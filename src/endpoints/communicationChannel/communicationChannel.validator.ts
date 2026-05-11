import { Schema } from 'express-validator';

export const communicationChannelValidator: Schema = {
  to: {
    in: 'body',
    exists: {
      errorMessage: 'Recipient email is required'
    },
    isEmail: {
      errorMessage: 'Recipient email is not valid'
    },
    normalizeEmail: true
  },
  subject: {
    in: 'body',
    exists: {
      errorMessage: 'Subject is required'
    },
    isString: {
      errorMessage: 'Subject must be a string'
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Subject cannot be empty'
    },
    isLength: {
      options: { max: 200 },
      errorMessage: 'Subject cannot exceed 200 characters'
    }
  },
  body: {
    in: 'body',
    exists: {
      errorMessage: 'Body is required'
    },
    isString: {
      errorMessage: 'Body must be a string'
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Body cannot be empty'
    },
    isLength: {
      options: { max: 20000 },
      errorMessage: 'Body cannot exceed 20000 characters'
    }
  }
};
