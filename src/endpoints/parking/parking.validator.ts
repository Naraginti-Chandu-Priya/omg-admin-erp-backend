import { Schema } from 'express-validator';

export const addParkingZoneValidator: Schema = {
  area_name: {
    in: 'body',
    exists: { errorMessage: 'Area Name is required' },
    isString: true,
    trim: true
  },
  total_capacity: {
    in: 'body',
    exists: { errorMessage: 'Total Capacity is required' },
    isInt: {
      options: [{ min: 1 }],
      errorMessage: 'Total Capacity must be a positive integer'
    }
  },
  access_category: {
    in: 'body',
    exists: { errorMessage: 'Access Category is required' },
    isIn: {
      options: [['general', 'staff', 'vip']],
      errorMessage: 'Access Category must be general, staff, or vip'
    }
  },
  area_theme: {
    in: 'body',
    optional: true,
    isIn: {
      options: [
        ['primary', 'secondary', 'destructive', 'purple', 'green', 'yellow']
      ],
      errorMessage: 'Invalid area theme'
    }
  },
  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['available', 'occupied', 'reserved']],
      errorMessage: 'Invalid status'
    }
  },
  price_per_hour: {
    in: 'body',
    exists: { errorMessage: 'Price per hour is required' },
    isIn: {
      options: [['100', '50', 'free']],
      errorMessage: 'Price per hour must be 100, 50, or free'
    }
  }
};

export const captureParkingEntryValidator: Schema = {
  parking_zone_id: {
    in: 'body',
    exists: { errorMessage: 'Parking Zone ID is required' },
    isUUID: { errorMessage: 'Parking Zone ID must be a valid UUID' }
  },
  licensePlate: {
    in: 'body',
    exists: { errorMessage: 'License Plate is required' },
    isString: true,
    trim: true
  },
  duration: {
    in: 'body',
    optional: true,
    isISO8601: { errorMessage: 'Duration (Entry Time) must be a valid date' }
  }
};
