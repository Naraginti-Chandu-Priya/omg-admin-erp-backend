import { Schema } from 'express-validator';

const isValidAllowedRoutes = (value: unknown): boolean => {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  return value.every(
    (route) => typeof route === 'string' && route.trim().length > 0
  );
};

const isValidRoutePermissions = (value: unknown): boolean => {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  return value.every((permission) => {
    if (!permission || typeof permission !== 'object') {
      return false;
    }

    const route =
      (permission as { route?: unknown }).route ||
      (permission as { path?: unknown }).path;
    const access = (permission as { access?: unknown }).access;

    return (
      typeof route === 'string' &&
      route.trim().length > 0 &&
      (access === 'read' || access === 'read_write')
    );
  });
};

export const onboardAdminValidator: Schema = {
  firstName: {
    in: 'body',
    exists: { errorMessage: 'First name is required' },
    isString: { errorMessage: 'First name must be a string' },
    trim: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'First name must be between 2 and 50 characters'
    }
  },
  lastName: {
    in: 'body',
    exists: { errorMessage: 'Last name is required' },
    isString: { errorMessage: 'Last name must be a string' },
    trim: true,
    isLength: {
      options: { min: 1, max: 50 },
      errorMessage: 'Last name must be between 1 and 50 characters'
    }
  },
  email: {
    in: 'body',
    exists: { errorMessage: 'Email is required' },
    isEmail: { errorMessage: 'Email is not valid' },
    normalizeEmail: true
  },
  phoneNumber: {
    in: 'body',
    optional: true,
    isString: { errorMessage: 'Phone number must be a string' },
    trim: true,
    matches: {
      options: [/^\d+$/],
      errorMessage: 'Phone number must contain only digits'
    },
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: 'Phone number must be between 10 and 20 digits'
    }
  },
  allowedRoutes: {
    in: 'body',
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (value === undefined) {
          return isValidRoutePermissions(req.body?.routePermissions);
        }

        return isValidAllowedRoutes(value);
      },
      errorMessage:
        'allowedRoutes must be a non-empty array of frontend route paths or provide valid routePermissions'
    }
  },
  routePermissions: {
    in: 'body',
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (value === undefined) {
          return isValidAllowedRoutes(req.body?.allowedRoutes);
        }

        return isValidRoutePermissions(value);
      },
      errorMessage:
        'routePermissions must be a non-empty array of { path, access } where access is read or read_write'
    }
  },
  templeId: {
    in: 'body',
    optional: true,
    isInt: { errorMessage: 'templeId must be an integer' },
    toInt: true
  }
};

export const updateUserValidator: Schema = {
  firstName: {
    in: 'body',
    optional: true,
    isString: { errorMessage: 'First name must be a string' },
    trim: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'First name must be between 2 and 50 characters'
    }
  },
  lastName: {
    in: 'body',
    optional: true,
    isString: { errorMessage: 'Last name must be a string' },
    trim: true,
    isLength: {
      options: { min: 1, max: 50 },
      errorMessage: 'Last name must be between 1 and 50 characters'
    }
  },
  email: {
    in: 'body',
    optional: true,
    isEmail: { errorMessage: 'Email is not valid' },
    normalizeEmail: true
  },
  phoneNumber: {
    in: 'body',
    optional: true,
    isString: { errorMessage: 'Phone number must be a string' },
    trim: true,
    matches: {
      options: [/^\d+$/],
      errorMessage: 'Phone number must contain only digits'
    },
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: 'Phone number must be between 10 and 15 digits'
    }
  },
  accountStatus: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['active', 'suspended', 'inactive']],
      errorMessage: 'Account status must be active, suspended, or inactive'
    }
  },
  routePermissions: {
    in: 'body',
    optional: true,
    custom: {
      options: (value) => isValidRoutePermissions(value),
      errorMessage:
        'routePermissions must be a non-empty array of { path, access } where access is read or read_write'
    }
  }
};

export const getUserByIdValidator: Schema = {
  id: {
    in: 'params',
    exists: { errorMessage: 'User ID is required' },
    isInt: { errorMessage: 'User ID must be an integer' }
  }
};

export const deleteUserValidator: Schema = {
  id: {
    in: 'params',
    exists: { errorMessage: 'User ID is required' },
    isInt: { errorMessage: 'User ID must be an integer' }
  }
};
