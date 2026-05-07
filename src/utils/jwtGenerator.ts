import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  sessionId: string;
  authLevel: 'L1' | 'L2';
  email?: string;
  roleId?: number;
}

function getRequiredSecret(key: 'ACCESS_TOKEN' | 'REFRESH_TOKEN'): string {
  const secret = process.env[key]?.trim();
  if (!secret) {
    throw new Error(`${key} environment variable is required`);
  }

  return secret;
}

const ACCESS_TOKEN_SECRET = getRequiredSecret('ACCESS_TOKEN');
const REFRESH_TOKEN_SECRET = getRequiredSecret('REFRESH_TOKEN');

/**
 * Generates an Access Token
 * @param payload - User data to be encoded
 * @param expiresIn - Token expiry time (default: 15m)
 * @returns string - JWT access token
 */
export function generateAccessToken(
  payload: JwtPayload,
  expiresIn: string = '15m'
): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn
  });
}

/**
 * Verifies an Access Token
 * @param token - JWT access token
 * @returns JwtPayload - Decoded user data
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
}

/**
 * Generates a Refresh Token
 * @param payload - User data to be encoded
 * @returns string - JWT refresh token
 */
export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'
  });
}

/**
 * Verifies a Refresh Token
 * @param token - JWT refresh token
 * @returns JwtPayload - Decoded user data
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
}
