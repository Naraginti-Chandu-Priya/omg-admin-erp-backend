import jwt from 'jsonwebtoken';

export const generateSecretToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '72h'
  });
};
