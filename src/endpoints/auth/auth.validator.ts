import { Schema } from 'express-validator';

export const loginValidator: Schema = {
  email: {
    in: 'body',
    exists: {
      errorMessage: 'Email is required'
    },
    isEmail: {
      errorMessage: 'Email is not valid'
    },
    normalizeEmail: true
  },
  password: {
    in: 'body',
    exists: {
      errorMessage: 'Password is required'
    }
  }
};

export const refreshValidator: Schema = {};
export const logoutValidator: Schema = {};
export const createPasswordValidator: Schema = {
  hash: {
    in: 'body',
    exists: {
      errorMessage: 'Hash is required'
    },
    isString: {
      errorMessage: 'Hash must be a string'
    },
    notEmpty: {
      errorMessage: 'Hash cannot be empty'
    }
  }
};

export const resetPasswordValidator: Schema = {
  email: {
    in: 'body',
    exists: {
      errorMessage: 'Email is required'
    },
    isEmail: {
      errorMessage: 'Email is not valid'
    },
    normalizeEmail: true
  }
};

export const verifyOtpResetPasswordValidator: Schema = {
  email: {
    in: 'body',
    exists: {
      errorMessage: 'Email is required'
    },
    isEmail: {
      errorMessage: 'Email is not valid'
    },
    normalizeEmail: true
  },
  otp: {
    in: 'body',
    exists: {
      errorMessage: 'OTP is required'
    },
    isString: {
      errorMessage: 'OTP must be a string'
    },
    notEmpty: {
      errorMessage: 'OTP cannot be empty'
    }
  }
};

export const completePasswordResetValidator: Schema = {
  hash: {
    in: 'body',
    exists: {
      errorMessage: 'Hash is required'
    },
    isString: {
      errorMessage: 'Hash must be a string'
    },
    notEmpty: {
      errorMessage: 'Hash cannot be empty'
    }
  },
  password: {
    in: 'body',
    exists: {
      errorMessage: 'Password is required'
    },
    isString: {
      errorMessage: 'Password must be a string'
    },
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long'
    }
  }
};
