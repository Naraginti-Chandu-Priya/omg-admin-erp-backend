import { Schema } from 'express-validator';

export const addTempleEventValidator: Schema = {
  eventName: {
    in: 'body',
    exists: { errorMessage: 'Event name is required' },
    isString: true,
    trim: true,
    notEmpty: { errorMessage: 'Event name cannot be empty' }
  },
  festivalName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  description: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  date: {
    in: 'body',
    exists: { errorMessage: 'Date is required' },
    isISO8601: { errorMessage: 'Invalid date format' }
  },
  time: {
    in: 'body',
    exists: { errorMessage: 'Time is required' },
    isString: true,
    trim: true
  },
  organizerName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Planned', 'Scheduled', 'In Progress', 'Completed']],
      errorMessage: 'Invalid status'
    }
  },
  expectedDevotees: {
    in: 'body',
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: 'Expected devotees must be a positive integer'
    }
  },
  poojaType: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  prasadamPlanned: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  resourceNeeded: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  isRecurring: {
    in: 'body',
    optional: true,
    isBoolean: { errorMessage: 'isRecurring must be a boolean' }
  }
};

export const updateTempleEventValidator: Schema = {
  eventName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true,
    notEmpty: { errorMessage: 'Event name cannot be empty' }
  },
  festivalName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  description: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  date: {
    in: 'body',
    optional: true,
    isISO8601: { errorMessage: 'Invalid date format' }
  },
  time: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  organizerName: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Planned', 'Scheduled', 'In Progress', 'Completed']],
      errorMessage: 'Invalid status'
    }
  },
  expectedDevotees: {
    in: 'body',
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: 'Expected devotees must be a positive integer'
    }
  },
  poojaType: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  prasadamPlanned: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  resourceNeeded: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  isRecurring: {
    in: 'body',
    optional: true,
    isBoolean: { errorMessage: 'isRecurring must be a boolean' }
  }
};

export const emptyValidator: Schema = {};
