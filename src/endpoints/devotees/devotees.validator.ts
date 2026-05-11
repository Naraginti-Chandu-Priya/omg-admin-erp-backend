import { Schema } from 'express-validator';

export const addDevoteeValidator: Schema = {
  firstName: {
    in: 'body',
    exists: { errorMessage: 'First name is required' },
    isString: true,
    trim: true
  },
  lastName: {
    in: 'body',
    exists: { errorMessage: 'Last name is required' },
    isString: true,
    trim: true
  },
  status: {
    in: 'body',
    exists: { errorMessage: 'Status is required' },
    isIn: {
      options: [['Active', 'Inactive']],
      errorMessage: 'Invalid status'
    }
  },
  phone: {
    in: 'body',
    optional: true,
    isString: true
  },
  email: {
    in: 'body',
    optional: true,
    isEmail: { errorMessage: 'Invalid email' }
  }
};
export const updateDevoteeValidator: Schema = {
  firstName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  lastName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Active', 'Inactive']],
      errorMessage: 'Invalid status'
    }
  },
  phone: {
    in: 'body',
    optional: true,
    isString: true
  },
  email: {
    in: 'body',
    optional: true,
    isEmail: { errorMessage: 'Invalid email' }
  }
};
export const emptyValidator: Schema = {};
