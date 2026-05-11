import { Schema } from 'express-validator';

export const addBookingValidator: Schema = {
  hallId: {
    in: 'body',
    exists: { errorMessage: 'Hall ID is required' },
    isString: true
  },
  eventDate: {
    in: 'body',
    exists: { errorMessage: 'Event date is required' },
    isString: true
  },
  slot: {
    in: 'body',
    exists: { errorMessage: 'Slot is required' },
    isIn: {
      options: [['full_day', 'half_day_morning', 'half_day_evening', 'custom']],
      errorMessage: 'Invalid slot'
    }
  },
  baseAmount: {
    in: 'body',
    exists: { errorMessage: 'Base amount is required' },
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Base amount must be a positive number'
    }
  },
  devoteeId: {
    in: 'body',
    optional: true,
    isString: true
  },
  bookerName: {
    in: 'body',
    optional: true,
    isString: true
  },
  bookerPhone: {
    in: 'body',
    optional: true,
    isString: true
  },
  bookerEmail: {
    in: 'body',
    optional: true,
    isEmail: { errorMessage: 'Invalid email' }
  },
  eventCategory: {
    in: 'body',
    optional: true,
    isString: true
  },
  guestCount: {
    in: 'body',
    optional: true,
    isInt: {
      options: [{ min: 1 }],
      errorMessage: 'Guest count must be a positive integer'
    }
  },
  festivalCharge: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Festival charge must be a positive number'
    }
  },
  amountPaid: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Amount paid must be a positive number'
    }
  },
  paymentStatus: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['pending', 'partial', 'paid']],
      errorMessage: 'Invalid payment status'
    }
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['pending', 'confirmed', 'cancelled']],
      errorMessage: 'Invalid status'
    }
  }
};

export const updateBookingValidator: Schema = {
  hallId: {
    in: 'body',
    optional: true,
    isString: true
  },
  eventDate: {
    in: 'body',
    optional: true,
    isString: true
  },
  slot: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['full_day', 'half_day_morning', 'half_day_evening', 'custom']],
      errorMessage: 'Invalid slot'
    }
  },
  baseAmount: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Base amount must be a positive number'
    }
  },
  festivalCharge: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Festival charge must be a positive number'
    }
  },
  amountPaid: {
    in: 'body',
    optional: true,
    isFloat: {
      options: [{ min: 0 }],
      errorMessage: 'Amount paid must be a positive number'
    }
  },
  paymentStatus: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['pending', 'partial', 'paid']],
      errorMessage: 'Invalid payment status'
    }
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['pending', 'confirmed', 'cancelled']],
      errorMessage: 'Invalid status'
    }
  }
};
