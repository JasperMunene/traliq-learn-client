/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Use environment variable or fallback to local API (localhost is preferred for OAuth redirect URIs)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/signin`,
    logout: `${API_BASE_URL}/auth/logout`,
    refreshToken: `${API_BASE_URL}/auth/refresh-token`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    resendVerification: `${API_BASE_URL}/auth/resend-verification`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    verifyResetToken: `${API_BASE_URL}/auth/verify-reset-token`,
    googleOAuth: `${API_BASE_URL}/auth/google`,
    loginMethod: `${API_BASE_URL}/auth/login-method`,
  },
  
  // Payment endpoints
  payments: {
    initialize: `${API_BASE_URL}/api/payments/initialize`,
    webhook: `${API_BASE_URL}/api/webhooks/paystack`,
    verify: (reference: string) => `${API_BASE_URL}/api/payments/verify/${reference}`,
    history: `${API_BASE_URL}/api/payments/history`,
  },
  
  // Users
  users: {
    me: `${API_BASE_URL}/api/users/me`,
    role: `${API_BASE_URL}/api/users/me/role`,
    profile: `${API_BASE_URL}/api/user/profile`,
  },
  
  // Course endpoints
  courses: {
    list: `${API_BASE_URL}/courses`,
    detail: (courseId: string) => `${API_BASE_URL}/courses/${courseId}`,
    modules: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/modules`,
    assets: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/assets`,
    enroll: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/enroll`,
    sessionStatus: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/session-status`,
    join: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/join`,
    leave: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/leave`,
  },

  // Enrollments
  enrollments: {
    mine: `${API_BASE_URL}/users/me/enrollments`,
  },
};

