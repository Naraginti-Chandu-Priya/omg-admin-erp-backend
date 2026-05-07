import { Schema } from 'express-validator';

export const createTempleValidator: Schema = {
  name: {
    in: 'body',
    exists: { errorMessage: 'Name is required' },
    isString: true
  },
  code: {
    in: 'body',
    exists: { errorMessage: 'Code is required' },
    isString: true
  },
  email: {
    in: 'body',
    exists: { errorMessage: 'Email is required' },
    isEmail: { errorMessage: 'Invalid email address' }
  }
};

export const updateTempleValidator: Schema = {
  name: {
    in: 'body',
    optional: true,
    isString: true
  },
  email: {
    in: 'body',
    optional: true,
    isEmail: { errorMessage: 'Invalid email address' }
  }
};

export const updateTempleStatusValidator: Schema = {
  status: {
    in: 'body',
    exists: { errorMessage: 'Status is required' },
    isIn: {
      options: [['active', 'inactive']],
      errorMessage: 'Status must be active or inactive'
    }
  }
};
