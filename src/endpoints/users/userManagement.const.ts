export const ONBOARD_ADMIN_UNAUTHORIZED = 'Unauthorized request';
export const ONBOARD_ADMIN_FORBIDDEN =
  'Only superadmin can onboard admin users';
export const ONBOARD_ADMIN_ROLE_NOT_FOUND = 'Admin role is not configured';
export const ONBOARD_ADMIN_EMAIL_EXISTS =
  'A user with this email already exists';
export const ONBOARD_ADMIN_ROUTE_REQUIRED =
  'At least one valid route permission is required (read or read_write)';
export const ONBOARD_ADMIN_ERROR = 'Unable to onboard admin user';

export const GET_USERS_UNAUTHORIZED = 'Unauthorized request';
export const GET_USERS_FORBIDDEN = 'Only superadmin can view all users';
export const GET_USERS_ERROR = 'Unable to retrieve users';

export const GET_USER_UNAUTHORIZED = 'Unauthorized request';
export const GET_USER_FORBIDDEN = 'Only superadmin can view user details';
export const GET_USER_NOT_FOUND = 'User not found';
export const GET_USER_ERROR = 'Unable to retrieve user';

export const UPDATE_USER_UNAUTHORIZED = 'Unauthorized request';
export const UPDATE_USER_FORBIDDEN = 'Only superadmin can update users';
export const UPDATE_USER_NOT_FOUND = 'User not found';
export const UPDATE_USER_EMAIL_EXISTS = 'Email already in use by another user';
export const UPDATE_USER_ERROR = 'Unable to update user';

export const DELETE_USER_UNAUTHORIZED = 'Unauthorized request';
export const DELETE_USER_FORBIDDEN = 'Only superadmin can delete users';
export const DELETE_USER_NOT_FOUND = 'User not found';
export const DELETE_USER_CANNOT_DELETE_SELF = 'Cannot delete your own account';
export const DELETE_USER_ERROR = 'Unable to delete user';
