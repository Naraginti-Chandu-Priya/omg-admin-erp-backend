import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  addDistributionHandler,
  getDistributionsHandler,
  getDistributionHandler,
  updateDistributionHandler,
  deleteDistributionHandler
} from './distribution.handler';

const emptyValidator = {};

export const addDistributionEndpoint = new Endpoint({
  path: '/distribution',
  method: EndpointMethod.POST,
  handler: addDistributionHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getDistributionsEndpoint = new Endpoint({
  path: '/distribution',
  method: EndpointMethod.GET,
  handler: getDistributionsHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getDistributionEndpoint = new Endpoint({
  path: '/distribution/:id',
  method: EndpointMethod.GET,
  handler: getDistributionHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updateDistributionEndpoint = new Endpoint({
  path: '/distribution/:id',
  method: EndpointMethod.PUT,
  handler: updateDistributionHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const deleteDistributionEndpoint = new Endpoint({
  path: '/distribution/:id',
  method: EndpointMethod.DELETE,
  handler: deleteDistributionHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
