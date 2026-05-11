import { Schema } from 'express-validator';

export const addHallValidator: Schema = {
  name: {
    in: 'body',
    exists: { errorMessage: 'Name is required' },
    isString: true,
    trim: true
  },
  capacity: {
    in: 'body',
    exists: { errorMessage: 'Capacity is required' },
    isInt: {
      options: [{ min: 1 }],
      errorMessage: 'Capacity must be a positive integer'
    }
  },
  pricingStrategy: {
    in: 'body',
    exists: { errorMessage: 'Pricing strategy is required' },
    isIn: {
      options: ['hourly', 'daily', 'tiered'],
      errorMessage:
        'Invalid pricing strategy. Must be one of: hourly, daily, tiered'
    }
  },
  description: {
    in: 'body',
    optional: true,
    isString: true
  },
  location: {
    in: 'body',
    optional: true,
    isString: true
  },
  ratePerHour: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Rate per hour must be a positive number'
    }
  },
  ratePerDay: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Rate per day must be a positive number'
    }
  },
  depositAmount: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Deposit amount must be a positive number'
    }
  },
  amenities: {
    in: 'body',
    optional: true,
    isArray: { errorMessage: 'Amenities must be an array' }
  },
  images: {
    in: 'body',
    optional: true,
    isArray: { errorMessage: 'Images must be an array' }
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: ['Active', 'Inactive'],
      errorMessage: 'Invalid status'
    }
  }
};

export const updateHallValidator: Schema = {
  name: {
    in: 'body',
    optional: true,
    isString: true,
    trim: true
  },
  capacity: {
    in: 'body',
    optional: true,
    isInt: {
      options: [{ min: 1 }],
      errorMessage: 'Capacity must be a positive integer'
    }
  },
  pricingStrategy: {
    in: 'body',
    optional: true,
    isIn: {
      options: ['hourly', 'daily', 'tiered'],
      errorMessage: 'Invalid pricing strategy'
    }
  },
  description: {
    in: 'body',
    optional: true,
    isString: true
  },
  location: {
    in: 'body',
    optional: true,
    isString: true
  },
  ratePerHour: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Rate per hour must be a positive number'
    }
  },
  ratePerDay: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Rate per day must be a positive number'
    }
  },
  depositAmount: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Deposit amount must be a positive number'
    }
  },
  amenities: {
    in: 'body',
    optional: true,
    isArray: { errorMessage: 'Amenities must be an array' }
  },
  images: {
    in: 'body',
    optional: true,
    isArray: { errorMessage: 'Images must be an array' }
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: ['Active', 'Inactive'],
      errorMessage: 'Invalid status'
    }
  }
};
