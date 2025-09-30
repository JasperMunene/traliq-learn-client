/**
 * JWT Token Utilities
 * Handles JWT token parsing and expiration checking
 */

interface JWTPayload {
    exp?: number;
    iat?: number;
    sub?: string;
    [key: string]: unknown;
}

/**
 * Decode a JWT token without verification
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}

/**
 * Check if a JWT token is expired
 * @param token - The JWT token string
 * @param bufferSeconds - Optional buffer time in seconds (default: 60)
 * @returns true if token is expired or will expire within buffer time
 */
export function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp - now <= bufferSeconds;
}

/**
 * Get the expiration time of a JWT token
 * @param token - The JWT token string
 * @returns The expiration timestamp in seconds, or null if not available
 */
export function getTokenExpiration(token: string): number | null {
    const payload = decodeJWT(token);
    return payload?.exp || null;
}

/**
 * Get the time remaining until token expiration
 * @param token - The JWT token string
 * @returns Time remaining in seconds, or 0 if expired/invalid
 */
export function getTimeUntilExpiration(token: string): number {
    const exp = getTokenExpiration(token);
    if (!exp) {
        return 0;
    }

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, exp - now);
}
