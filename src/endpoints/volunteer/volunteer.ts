import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';

import {
  addVolunteerHandler,
  getVolunteersHandler,
  getVolunteerHandler,
  updateVolunteerHandler,
  deleteVolunteerHandler
} from './volunteer.handler';

import {
  addVolunteerValidator,
  updateVolunteerValidator,
  emptyValidator
} from './volunteer.validator';

export const addVolunteerEndpoint = new Endpoint({
  path: '/volunteers',
  method: EndpointMethod.POST,
  handler: addVolunteerHandler,
  authType: EndpointAuthType.NONE,
  validator: addVolunteerValidator
});

export const getVolunteersEndpoint = new Endpoint({
  path: '/volunteers',
  method: EndpointMethod.GET,
  handler: getVolunteersHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getVolunteerEndpoint = new Endpoint({
  path: '/volunteers/:id',
  method: EndpointMethod.GET,
  handler: getVolunteerHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updateVolunteerEndpoint = new Endpoint({
  path: '/volunteers/:id',
  method: EndpointMethod.PUT,
  handler: updateVolunteerHandler,
  authType: EndpointAuthType.NONE,
  validator: updateVolunteerValidator
});

export const deleteVolunteerEndpoint = new Endpoint({
  path: '/volunteers/:id',
  method: EndpointMethod.DELETE,
  handler: deleteVolunteerHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
