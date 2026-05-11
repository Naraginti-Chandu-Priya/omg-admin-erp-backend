import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import {
  addTempleEventHandler,
  getTempleEventsHandler,
  getTempleEventHandler,
  updateTempleEventHandler,
  deleteTempleEventHandler,
  getEventsByMonthHandler
} from './templeEvents.handler';
import {
  addTempleEventValidator,
  updateTempleEventValidator,
  emptyValidator
} from './templeEvents.validator';

export const addTempleEventEndpoint = new Endpoint({
  path: '/temple-events',
  method: EndpointMethod.POST,
  handler: addTempleEventHandler,
  authType: EndpointAuthType.NONE,
  validator: addTempleEventValidator
});

export const getTempleEventsEndpoint = new Endpoint({
  path: '/temple-events',
  method: EndpointMethod.GET,
  handler: getTempleEventsHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getTempleEventEndpoint = new Endpoint({
  path: '/temple-events/:id',
  method: EndpointMethod.GET,
  handler: getTempleEventHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updateTempleEventEndpoint = new Endpoint({
  path: '/temple-events/:id',
  method: EndpointMethod.PUT,
  handler: updateTempleEventHandler,
  authType: EndpointAuthType.NONE,
  validator: updateTempleEventValidator
});

export const deleteTempleEventEndpoint = new Endpoint({
  path: '/temple-events/:id',
  method: EndpointMethod.DELETE,
  handler: deleteTempleEventHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getEventsByMonthEndpoint = new Endpoint({
  path: '/temple-events/monthly',
  method: EndpointMethod.POST,
  handler: getEventsByMonthHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
