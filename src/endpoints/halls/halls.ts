import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  addHallHandler,
  updateHallHandler,
  deleteHallHandler,
  getHallHandler,
  getAllHallsHandler
} from './handlers';
import { addHallValidator, updateHallValidator } from './halls.validator';

export const addHallEndpoint = new Endpoint({
  path: '/halls',
  method: EndpointMethod.POST,
  handler: addHallHandler,
  authType: EndpointAuthType.NONE,
  validator: addHallValidator
});

export const updateHallEndpoint = new Endpoint({
  path: '/halls/:id',
  method: EndpointMethod.PUT,
  handler: updateHallHandler,
  authType: EndpointAuthType.NONE,
  validator: updateHallValidator
});

export const deleteHallEndpoint = new Endpoint({
  path: '/halls/:id',
  method: EndpointMethod.DELETE,
  handler: deleteHallHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const getHallEndpoint = new Endpoint({
  path: '/halls/:id',
  method: EndpointMethod.GET,
  handler: getHallHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const getAllHallsEndpoint = new Endpoint({
  path: '/halls',
  method: EndpointMethod.GET,
  handler: getAllHallsHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});
