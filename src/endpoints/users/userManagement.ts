import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import {
  onboardAdminHandler,
  getAllUsersHandler,
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
  authType: EndpointAuthType.JWT,
  validator: onboardAdminValidator
});

export const onboardSuperadminEndpoint = new Endpoint({
  path: '/users/superadmin/onboard',
  method: EndpointMethod.POST,
  handler: onboardSuperadminHandler,
  authType: EndpointAuthType.JWT,
  validator: onboardAdminValidator
});

export const getAllUsersEndpoint = new Endpoint({
  path: '/users',
  method: EndpointMethod.GET,
  handler: getAllUsersHandler,
  authType: EndpointAuthType.JWT,
  validator: {}
});

export const getUserByIdEndpoint = new Endpoint({
  path: '/users/:id',
  method: EndpointMethod.GET,
  handler: getUserByIdHandler,
  authType: EndpointAuthType.JWT,
  validator: getUserByIdValidator
});

export const updateUserEndpoint = new Endpoint({
  path: '/users/:id',
  method: EndpointMethod.PUT,
  handler: updateUserHandler,
  authType: EndpointAuthType.JWT,
  validator: updateUserValidator
});

export const deleteUserEndpoint = new Endpoint({
  path: '/users/:id',
  method: EndpointMethod.DELETE,
  handler: deleteUserHandler,
  authType: EndpointAuthType.JWT,
  validator: deleteUserValidator
});
