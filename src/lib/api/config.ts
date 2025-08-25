// src/lib/api/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.10.12.9:8002',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login/',
      REGISTER: '/api/auth/register/',
      PROFILE: '/api/auth/profile/',
      ALL_USERS: '/api/auth/all-users/',
      OTP_CREATE: '/api/auth/otp/create/',
      OTP_VERIFY: '/api/auth/otp/verify/',
      PASSWORD_RESET_REQUEST: '/api/auth/password-reset/request/',
      PASSWORD_RESET_CONFIRM: '/api/auth/password-reset/confirm/',
      PASSWORD_CHANGE: '/api/auth/password-change/',
      RESET_OTP_VERIFY: '/api/auth/reset/otp-verify/',
    },
    MILK_HISTORY: {
      CREATE: '/api/milk-history/create/',
      LIST: '/api/milk-history/',
      BY_USER: '/api/milk-history/user/',
    },
    MEMBERS: {
      CREATE: '/api/members/create/',
      BY_FARM: '/api/members/farm/',
      PROFILE: '/api/members/profile/',
    },
    CONSULTANTS: {
      SEARCH_FARM: '/api/consultants/search/farm/',
      REQUEST: '/api/consultants/request/',
      FARM_LIST: '/api/consultants/farm/list',
      REQUEST_MANAGE: '/api/consultants/request/',
    },
    PAYMENT: {
      ALL_SUBSCRIPTIONS: '/api/payment/all-subscriptions/',
    },
    NOTIFICATIONS: {
      LIST: '/api/notifications/',
      MARK_READ: '/api/notifications/mark-read/',
    },
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;