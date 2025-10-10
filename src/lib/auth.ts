/**
 * Professional Authentication Service
 * Centralized auth management with cookie-based token storage
 */

import { API_ENDPOINTS } from './config';
import { setTokens, getAccessToken, removeTokens } from './cookies';
import { initializeTokenRefresh } from './api';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  avatar_url: string | null;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface AuthError {
  error: string;
  needs_verification?: boolean;
  user_id?: string;
}

export interface OAuthCallbackData {
  token: string;
  refresh_token: string | null;
  email: string;
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  role: string;
  email_verified: string;
}

/**
 * Authentication Service Class
 */
export class AuthService {
  private static instance: AuthService;
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize Google OAuth flow
   */
  public initiateGoogleOAuth(): void {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = new URL(API_ENDPOINTS.auth.googleOAuth);
    if (origin) {
      url.searchParams.set('redirect_uri', origin);
    }
    window.location.href = url.toString();
  }

  /**
   * Process OAuth callback data and authenticate user
   */
  public async processOAuthCallback(params: URLSearchParams): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      // Check for OAuth errors
      const error = params.get('error');
      if (error) {
        return {
          success: false,
          error: this.getOAuthErrorMessage(error)
        };
      }

      // Extract OAuth data
      const oauthData = this.extractOAuthData(params);
      if (!oauthData) {
        return {
          success: false,
          error: 'Invalid authentication data received. Please try again.'
        };
      }

      // Store tokens and user data
      this.storeAuthData(oauthData);

      // Initialize token refresh
      initializeTokenRefresh();

      return {
        success: true,
        user: this.transformOAuthToUser(oauthData)
      };

    } catch (error) {
      console.error('OAuth callback processing error:', error);
      return {
        success: false,
        error: 'Failed to process authentication. Please try again.'
      };
    }
  }

  /**
   * Check if user is currently authenticated
   */
  public isAuthenticated(): boolean {
    return !!getAccessToken();
  }

  /**
   * Get current user from localStorage
   */
  public getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Store authentication data securely
   */
  private storeAuthData(data: OAuthCallbackData): void {
    // Store tokens in secure cookies
    setTokens(data.token, data.refresh_token || '', true);

    // Store user data in localStorage for immediate access
    const user: User = this.transformOAuthToUser(data);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Transform OAuth data to User interface
   */
  private transformOAuthToUser(data: OAuthCallbackData): User {
    return {
      id: data.id,
      email: decodeURIComponent(data.email),
      first_name: decodeURIComponent(data.first_name || ''),
      last_name: decodeURIComponent(data.last_name || ''),
      role: data.role,
      email_verified: data.email_verified === 'true',
      avatar_url: data.avatar_url ? decodeURIComponent(data.avatar_url) : null
    };
  }

  /**
   * Extract OAuth data from URL parameters
   */
  private extractOAuthData(params: URLSearchParams): OAuthCallbackData | null {
    const token = params.get('token');
    const refresh_token = params.get('refresh_token');
    const email = params.get('email');
    const id = params.get('id');
    const first_name = params.get('first_name');
    const last_name = params.get('last_name');
    const avatar_url = params.get('avatar_url');
    const role = params.get('role');
    const email_verified = params.get('email_verified');

    // Validate required fields
    if (!token || !email || !id) {
      return null;
    }

    return {
      token,
      refresh_token,
      email,
      id,
      first_name: first_name || '',
      last_name: last_name || '',
      avatar_url: avatar_url || '',
      role: role || 'learner',
      email_verified: email_verified || 'false'
    };
  }

  /**
   * Get user-friendly OAuth error message
   */
  private getOAuthErrorMessage(error: string): string {
    switch (error) {
      case 'oauth_failed':
        return 'Failed to connect with Google. Please try again.';
      case 'authentication_failed':
        return 'Authentication process failed. Please try again.';
      case 'access_denied':
        return 'Google authentication was cancelled. Please try again.';
      default:
        return 'An unexpected error occurred during authentication.';
    }
  }

  /**
   * Sign out user
   */
  public signOut(): void {
    removeTokens();
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
