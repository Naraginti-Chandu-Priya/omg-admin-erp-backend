import { Schema } from 'express-validator';

export const addStaffValidator: Schema = {
  fullName: {
    in: 'body',
    exists: { errorMessage: 'Full name is required' },
    isString: true,
    trim: true,
    notEmpty: { errorMessage: 'Full name cannot be empty' }
  },

  staffRole: {
    in: 'body',
    exists: { errorMessage: 'Staff role is required' },
    isIn: {
      options: [['Priest', 'Support Staff']],
      errorMessage: 'Invalid staff role'
    }
  },

  joiningDate: {
    in: 'body',
    exists: { errorMessage: 'Joining date is required' },
    isISO8601: { errorMessage: 'Invalid date format' }
  },

  salary: {
    in: 'body',
    optional: true,
    isFloat: { options: { min: 0 }, errorMessage: 'Salary must be positive' }
  },

  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Active', 'Inactive']],
      errorMessage: 'Invalid status'
    }
  },

  email: {
    in: 'body',
    optional: true,
    isEmail: { errorMessage: 'Invalid email' }
  },

  phoneNumber: {
    in: 'body',
    optional: true,
    isMobilePhone: { options: ['any'], errorMessage: 'Invalid phone number' }
  }
};

export const updateStaffValidator: Schema = {
  fullName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  staffRole: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Priest', 'Support Staff']]
    }
  },
  joiningDate: {
    in: 'body',
    optional: true,
    isISO8601: true
  },
  salary: {
    in: 'body',
    optional: true,
    isFloat: { options: { min: 0 } }
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Active', 'Inactive']]
    }
  }
};

export const emptyValidator: Schema = {};
