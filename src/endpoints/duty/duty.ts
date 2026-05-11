import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';

import {
  addStaffDutyHandler,
  getStaffDutiesHandler,
  updateStaffDutyHandler,
  deleteStaffDutyHandler,
  getStaffDutyHandler
} from './duty.handler';

import {
  addStaffDutyValidator,
  updateStaffDutyValidator,
  emptyValidator
} from './duty.validator';

export const addStaffDutyEndpoint = new Endpoint({
  path: '/staff-duties',
  method: EndpointMethod.POST,
  handler: addStaffDutyHandler,
  authType: EndpointAuthType.NONE,
  validator: addStaffDutyValidator
});

export const getStaffDutiesEndpoint = new Endpoint({
  path: '/staff-duties',
  method: EndpointMethod.GET,
  handler: getStaffDutiesHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getStaffDutyEndpoint = new Endpoint({
  path: '/staff-duties/:id',
  method: EndpointMethod.GET,
  handler: getStaffDutyHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updateStaffDutyEndpoint = new Endpoint({
  path: '/staff-duties/:id',
  method: EndpointMethod.PUT,
  handler: updateStaffDutyHandler,
  authType: EndpointAuthType.NONE,
  validator: updateStaffDutyValidator
});

export const deleteStaffDutyEndpoint = new Endpoint({
  path: '/staff-duties/:id',
  method: EndpointMethod.DELETE,
  handler: deleteStaffDutyHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
