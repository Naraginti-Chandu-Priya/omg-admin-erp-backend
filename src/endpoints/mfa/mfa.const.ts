export const MFA_TAG = 'mfa';

export const MFA_UNAUTHORIZED = 'Unauthorized';
export const MFA_USER_NOT_FOUND = 'User not found';
export const MFA_INTERNAL_ERROR = 'Internal server error';
export const MFA_TOTP_REQUIRED = 'TOTP code is required';
export const MFA_INVALID_TOTP = 'Invalid TOTP code';

export const MFA_SETUP_SUCCESS = 'MFA setup initiated';

export const MFA_SETUP_NOT_INITIATED = 'MFA setup not initiated';
export const MFA_INVALID_TOTP_RETRY = 'Invalid TOTP code. Please try again.';
export const MFA_ENABLED_SUCCESS = 'MFA enabled successfully';

export const MFA_NOT_SETUP = 'MFA is not set up for this user';
export const MFA_ACCOUNT_LOCKED =
  'Account temporarily locked. Please try again later.';
export const MFA_VERIFY_SUCCESS = 'MFA verification successful';

export const MAX_MFA_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
