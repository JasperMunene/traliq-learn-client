import { getAccessToken, getRefreshToken, setTokens, removeTokens } from './cookies';
import { isTokenExpired, getTimeUntilExpiration } from './jwt';

/**
 * Token refresh state management
 * Prevents multiple simultaneous refresh requests (mutex pattern)
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let refreshSchedulerInterval: NodeJS.Timeout | null = null;

/**
 * Centralized token refresh function with mutex to prevent race conditions
 * @returns The new access token or null if refresh failed
 */
const refreshToken = async (): Promise<string | null> => {
    // If already refreshing, return the existing promise
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
        console.warn('No refresh token available');
        return null;
    }

    // Set refreshing state and create promise
    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            console.log('Refreshing access token...');
            const response = await fetch('http://127.0.0.1:5000/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshTokenValue}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTokens(data.access_token, data.refresh_token, true);
                console.log('Token refreshed successfully');
                
                // Schedule next refresh
                scheduleTokenRefresh(data.access_token);
                
                return data.access_token;
            } else {
                console.error('Token refresh failed with status:', response.status);
                removeTokens();
                return null;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            removeTokens();
            return null;
        } finally {
            // Reset refreshing state
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

/**
 * Schedule automatic token refresh before expiration
 * @param token - The access token to monitor
 */
const scheduleTokenRefresh = (token: string) => {
    // Clear any existing scheduler
    if (refreshSchedulerInterval) {
        clearInterval(refreshSchedulerInterval);
        refreshSchedulerInterval = null;
    }

    const timeUntilExpiration = getTimeUntilExpiration(token);
    
    if (timeUntilExpiration <= 0) {
        console.warn('Token is already expired');
        return;
    }

    // Refresh token 2 minutes before expiration (or halfway through if token expires in less than 4 minutes)
    const refreshBuffer = Math.min(120, Math.floor(timeUntilExpiration / 2));
    const refreshIn = (timeUntilExpiration - refreshBuffer) * 1000; // Convert to milliseconds

    console.log(`Token will be refreshed in ${Math.floor(refreshIn / 1000)} seconds`);

    // Schedule the refresh
    const timeoutId = setTimeout(async () => {
        console.log('Scheduled token refresh triggered');
        await refreshToken();
    }, refreshIn);

    // Store timeout ID for cleanup
    refreshSchedulerInterval = timeoutId as NodeJS.Timeout;
};

/**
 * Initialize token refresh scheduler on app load
 * Call this function when your app initializes
 */
export const initializeTokenRefresh = () => {
    const token = getAccessToken();
    if (token && !isTokenExpired(token)) {
        scheduleTokenRefresh(token);
    }
};

/**
 * Clean up token refresh scheduler
 * Call this when user logs out or app unmounts
 */
export const cleanupTokenRefresh = () => {
    if (refreshSchedulerInterval) {
        clearInterval(refreshSchedulerInterval);
        refreshSchedulerInterval = null;
    }
};

/**
 * Enhanced fetch with automatic token management
 * - Checks token expiration before making requests
 * - Automatically refreshes expired tokens
 * - Handles 401 errors with retry logic
 * - Prevents race conditions with mutex pattern
 */
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    let token = getAccessToken();

    // Check if token exists and is not expired
    if (!token || isTokenExpired(token)) {
        console.log('Token missing or expired, attempting refresh...');
        const newToken = await refreshToken();
        
        if (!newToken) {
            // No token available, redirect to login
            console.error('Unable to obtain valid token, redirecting to login');
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return Promise.reject(new Error('No token available'));
        }
        
        token = newToken;
    }

    // Check if body is FormData to avoid setting Content-Type header
    const isFormData = options.body instanceof FormData;

    const config: RequestInit = {
        ...options,
        headers: {
            // Only set Content-Type for non-FormData requests
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    };

    let response = await fetch(endpoint, config);

    // Handle 401 Unauthorized - token might have expired during request
    if (response.status === 401) {
        console.log('Received 401 error, attempting token refresh...');
        const newToken = await refreshToken();
        
        if (newToken) {
            // Retry the request with new token
            config.headers = { 
                ...config.headers, 
                'Authorization': `Bearer ${newToken}` 
            };
            response = await fetch(endpoint, config);
            
            if (response.status === 401) {
                // Still unauthorized after refresh, redirect to login
                console.error('Still unauthorized after token refresh, redirecting to login');
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                return Promise.reject(new Error('Authentication failed'));
            }
        } else {
            // Refresh failed, redirect to login
            console.error('Token refresh failed, redirecting to login');
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return Promise.reject(new Error('Token refresh failed'));
        }
    }

    return response;
};
