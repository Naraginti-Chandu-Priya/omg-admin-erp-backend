import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import {
  addDevoteeHandler,
  updateDevoteeHandler,
  deleteDevoteeHandler,
  getDevoteeHandler,
  getAllDevoteesHandler
} from './handlers';
import {
  addDevoteeValidator,
  updateDevoteeValidator,
  emptyValidator
} from './devotees.validator';

export const addDevoteeEndpoint = new Endpoint({
  path: '/devotees',
  method: EndpointMethod.POST,
  handler: addDevoteeHandler,
  authType: EndpointAuthType.NONE,
  validator: addDevoteeValidator
});

export const updateDevoteeEndpoint = new Endpoint({
  path: '/devotees/:id',
  method: EndpointMethod.PUT,
  handler: updateDevoteeHandler,
  authType: EndpointAuthType.NONE,
  validator: updateDevoteeValidator
});

export const deleteDevoteeEndpoint = new Endpoint({
  path: '/devotees/:id',
  method: EndpointMethod.DELETE,
  handler: deleteDevoteeHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getDevoteeEndpoint = new Endpoint({
  path: '/devotees/:id',
  method: EndpointMethod.GET,
  handler: getDevoteeHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getAllDevoteesEndpoint = new Endpoint({
  path: '/devotees',
  method: EndpointMethod.GET,
  handler: getAllDevoteesHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
