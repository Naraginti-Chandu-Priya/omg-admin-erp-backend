import { Schema } from 'express-validator';

export const addStaffDutyValidator: Schema = {
  staffId: {
    in: 'body',
    exists: { errorMessage: 'Staff is required' }
  },
  dutyType: {
    in: 'body',
    isIn: {
      options: [
        [
          'Pooja Ritual',
          'Annadanam Service',
          'Temple Operations',
          'Administration',
          'Volunteer Coordination',
          'Maintenance'
        ]
      ]
    }
  },
  dutyDate: {
    in: 'body',
    isISO8601: true
  },
  timeSlot: {
    in: 'body',
    notEmpty: true
  }
};

export const updateStaffDutyValidator: Schema = {
  dutyStatus: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['Scheduled', 'Completed', 'Cancelled']]
    }
  }
};

export const emptyValidator: Schema = {};
