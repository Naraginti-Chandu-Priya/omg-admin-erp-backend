import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import {
  addPoojaSevaHandler,
  getPoojaSevasHandler,
  getPoojaSevaHandler,
  updatePoojaSevaHandler,
  deletePoojaSevaHandler
} from './poojasevas.handler';
import {
  addPoojaSevaValidator,
  updatePoojaSevaValidator,
  emptyValidator
} from './poojasevas.validator';

export const addPoojaSevaEndpoint = new Endpoint({
  path: '/poojasevas',
  method: EndpointMethod.POST,
  handler: addPoojaSevaHandler,
  authType: EndpointAuthType.NONE,
  validator: addPoojaSevaValidator
});

export const getPoojaSevasEndpoint = new Endpoint({
  path: '/poojasevas',
  method: EndpointMethod.GET,
  handler: getPoojaSevasHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getPoojaSevaEndpoint = new Endpoint({
  path: '/poojasevas/:id',
  method: EndpointMethod.GET,
  handler: getPoojaSevaHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updatePoojaSevaEndpoint = new Endpoint({
  path: '/poojasevas/:id',
  method: EndpointMethod.PUT,
  handler: updatePoojaSevaHandler,
  authType: EndpointAuthType.NONE,
  validator: updatePoojaSevaValidator
});

export const deletePoojaSevaEndpoint = new Endpoint({
  path: '/poojasevas/:id',
  method: EndpointMethod.DELETE,
  handler: deletePoojaSevaHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
