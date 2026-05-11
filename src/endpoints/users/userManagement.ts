import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import {
  onboardAdminHandler,
  getAllUsersHandler,
  getAllSuperadminsHandler,
  getAllAdminsHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
  onboardSuperadminHandler
} from './handlers';
import {
  onboardAdminValidator,
  updateUserValidator,
  getUserByIdValidator,
  deleteUserValidator
} from './userManagement.validator';

export const onboardAdminEndpoint = new Endpoint({
  path: '/users/admins/onboard',
  method: EndpointMethod.POST,
  handler: onboardAdminHandler,
  authType: EndpointAuthType.NONE,
  validator: onboardAdminValidator
});

export const onboardSuperadminEndpoint = new Endpoint({
  path: '/users/superadmin/onboard',
  method: EndpointMethod.POST,
  handler: onboardSuperadminHandler,
  authType: EndpointAuthType.NONE,
  validator: onboardAdminValidator
});

export const getAllUsersEndpoint = new Endpoint({
  path: '/users',
  method: EndpointMethod.GET,
  handler: getAllUsersHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const getAllSuperadminsEndpoint = new Endpoint({
  path: '/users/superadmins',
  method: EndpointMethod.GET,
  handler: getAllSuperadminsHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const getAllAdminsEndpoint = new Endpoint({
  path: '/users/admins',
  method: EndpointMethod.GET,
  handler: getAllAdminsHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const getUserByIdEndpoint = new Endpoint({
  path: '/users/:id',
  method: EndpointMethod.GET,
  handler: getUserByIdHandler,
  authType: EndpointAuthType.NONE,
  validator: getUserByIdValidator
});

export const updateUserEndpoint = new Endpoint({
  path: '/users/:id',
  method: EndpointMethod.PUT,
  handler: updateUserHandler,
  authType: EndpointAuthType.NONE,
  validator: updateUserValidator
});

export const deleteUserEndpoint = new Endpoint({
  path: '/users/:id',
  method: EndpointMethod.DELETE,
  handler: deleteUserHandler,
  authType: EndpointAuthType.NONE,
  validator: deleteUserValidator
});
