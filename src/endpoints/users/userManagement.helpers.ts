import crypto from 'crypto';
import { CreateSecret } from './userManagement.types';

const SECRET = process.env.ONBOARD_ADMIN_SECRET_KEY!;

export function generateSecretToken(data: CreateSecret) {
  const payload = JSON.stringify({
    userId: data.userId,
    exp: data.exp.toISOString(),
    passwordHash: data.passwordHash
  });

  const base64Payload = Buffer.from(payload).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(base64Payload)
    .digest('base64url');

  return `${base64Payload}.${signature}`;
}

export function decodeSecretToken(token: string) {
  try {
    const [base64Payload, signature] = token.split('.');

    if (!base64Payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(base64Payload)
      .digest('base64url');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) return null;

    const payload = JSON.parse(
      Buffer.from(base64Payload, 'base64url').toString()
    );

    if (new Date(payload.exp) < new Date()) {
      return null;
    }

    if (typeof payload.passwordHash !== 'string' || !payload.passwordHash) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
