import { Schema } from 'express-validator';

export const mfaSetupValidator: Schema = {};

export const mfaConfirmValidator: Schema = {
  totp: {
    in: 'body',
    exists: {
      errorMessage: 'TOTP code is required'
    },
    isString: {
      errorMessage: 'TOTP code must be a string'
    },
    notEmpty: {
      errorMessage: 'TOTP code cannot be empty'
    },
    isLength: {
      options: { min: 6, max: 6 },
      errorMessage: 'TOTP code must be exactly 6 digits'
    },
    isNumeric: {
      errorMessage: 'TOTP code must contain only digits'
    }
  }
};

export const mfaVerifyValidator: Schema = {
  totp: {
    in: 'body',
    exists: {
      errorMessage: 'TOTP code is required'
    },
    isString: {
      errorMessage: 'TOTP code must be a string'
    },
    notEmpty: {
      errorMessage: 'TOTP code cannot be empty'
    },
    isLength: {
      options: { min: 6, max: 6 },
      errorMessage: 'TOTP code must be exactly 6 digits'
    },
    isNumeric: {
      errorMessage: 'TOTP code must contain only digits'
    }
  }
};
