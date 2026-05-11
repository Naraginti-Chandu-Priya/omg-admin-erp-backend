import { Schema } from 'express-validator';

export const addPoojaSevaValidator: Schema = {
  sevaName: {
    in: 'body',
    exists: { errorMessage: 'Seva name is required' },
    isString: true,
    trim: true
  },
  sevaAmount: {
    in: 'body',
    exists: { errorMessage: 'Seva amount is required' },
    isDecimal: true
  },
  sevaDate: {
    in: 'body',
    exists: { errorMessage: 'Seva date is required' },
    isISO8601: { errorMessage: 'Invalid date format' }
  },
  devoteeId: {
    in: 'body',
    optional: true,
    isUUID: { errorMessage: 'Invalid devotee ID' }
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Scheduled', 'Completed', 'Cancelled']],
      errorMessage: 'Invalid status'
    }
  },
  paymentStatus: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Pending', 'Paid', 'Refunded']],
      errorMessage: 'Invalid payment status'
    }
  }
};

export const updatePoojaSevaValidator: Schema = {
  sevaName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  sevaAmount: {
    in: 'body',
    optional: true,
    isDecimal: true
  },
  sevaDate: {
    in: 'body',
    optional: true,
    isISO8601: { errorMessage: 'Invalid date format' }
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Scheduled', 'Completed', 'Cancelled']],
      errorMessage: 'Invalid status'
    }
  },
  paymentStatus: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Pending', 'Paid', 'Refunded']],
      errorMessage: 'Invalid payment status'
    }
  }
};

export const emptyValidator: Schema = {};
