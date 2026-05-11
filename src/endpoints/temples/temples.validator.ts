import { Schema } from 'express-validator';

export const createTempleValidator: Schema = {
  name: {
    in: 'body',
    exists: { errorMessage: 'Name is required' },
    isString: true
  },
  superadmin: {
    in: 'body',
    exists: { errorMessage: 'Superadmin details are required' }
  },
  'superadmin.firstName': {
    in: 'body',
    exists: { errorMessage: 'Superadmin first name is required' },
    isString: true
  },
  'superadmin.lastName': {
    in: 'body',
    exists: { errorMessage: 'Superadmin last name is required' },
    isString: true
  },
  'superadmin.email': {
    in: 'body',
    exists: { errorMessage: 'Superadmin email is required' },
    isEmail: { errorMessage: 'Invalid superadmin email address' }
  }
};

export const updateTempleValidator: Schema = {
  name: {
    in: 'body',
    optional: true,
    isString: true
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
