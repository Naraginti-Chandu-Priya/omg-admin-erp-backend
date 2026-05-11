import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  addInventoryHandler,
  getInventoriesHandler,
  getInventoryHandler,
  updateInventoryHandler,
  deleteInventoryHandler
} from './inventory.handler';

const emptyValidator = {};

export const addInventoryEndpoint = new Endpoint({
  path: '/inventory',
  method: EndpointMethod.POST,
  handler: addInventoryHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getInventoriesEndpoint = new Endpoint({
  path: '/inventory',
  method: EndpointMethod.GET,
  handler: getInventoriesHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getInventoryEndpoint = new Endpoint({
  path: '/inventory/:id',
  method: EndpointMethod.GET,
  handler: getInventoryHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updateInventoryEndpoint = new Endpoint({
  path: '/inventory/:id',
  method: EndpointMethod.PUT,
  handler: updateInventoryHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const deleteInventoryEndpoint = new Endpoint({
  path: '/inventory/:id',
  method: EndpointMethod.DELETE,
  handler: deleteInventoryHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
