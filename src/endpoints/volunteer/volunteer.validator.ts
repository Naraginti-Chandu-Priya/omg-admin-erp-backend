import { Schema } from 'express-validator';

export const addVolunteerValidator: Schema = {
  fullName: {
    in: 'body',
    exists: { errorMessage: 'Full name required' }
  },
  availability: {
    in: 'body',
    isIn: {
      options: [
        [
          'Morning (06:00 - 12:00)',
          'Evening (16:00 - 21:00)',
          'Full Day',
          'Weekends Only'
        ]
      ]
    }
  }
};

export const updateVolunteerValidator: Schema = {
  currentStatus: {
    in: 'body',
    optional: true,
    isIn: {
      options: [
        ['Registered', 'Active', 'Assigned (On Duty)', 'On Leave', 'Inactive']
      ]
    }
  }
};

export const emptyValidator: Schema = {};
