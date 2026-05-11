import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';

import {
  addStaffHandler,
  getStaffsHandler,
  getStaffHandler,
  updateStaffHandler,
  deleteStaffHandler
} from './staff.handler';

import {
  addStaffValidator,
  updateStaffValidator,
  emptyValidator
} from './staff.validator';

export const addStaffEndpoint = new Endpoint({
  path: '/staff',
  method: EndpointMethod.POST,
  handler: addStaffHandler,
  authType: EndpointAuthType.NONE,
  validator: addStaffValidator
});

export const getStaffsEndpoint = new Endpoint({
  path: '/staff',
  method: EndpointMethod.GET,
  handler: getStaffsHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getStaffEndpoint = new Endpoint({
  path: '/staff/:id',
  method: EndpointMethod.GET,
  handler: getStaffHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updateStaffEndpoint = new Endpoint({
  path: '/staff/:id',
  method: EndpointMethod.PUT,
  handler: updateStaffHandler,
  authType: EndpointAuthType.NONE,
  validator: updateStaffValidator
});

export const deleteStaffEndpoint = new Endpoint({
  path: '/staff/:id',
  method: EndpointMethod.DELETE,
  handler: deleteStaffHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
