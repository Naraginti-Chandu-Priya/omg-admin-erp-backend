import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import { validateCompanySuperAdmin } from '../../middlewares/validateCompanySuperAdmin';
import {
  createTempleValidator,
  updateTempleValidator,
  updateTempleStatusValidator
} from './temples.validator';
import {
  createTempleHandler,
  getAllTemplesHandler,
  getTempleByIdHandler,
  updateTempleHandler,
  updateTempleStatusHandler,
  deleteTempleHandler
} from './temples.handler';

export const createTempleEndpoint = new Endpoint({
  path: '/temples',
  method: EndpointMethod.POST,
  handler: createTempleHandler,
  authType: EndpointAuthType.JWT,
  validator: createTempleValidator,
  middleware: [validateCompanySuperAdmin]
});

export const getAllTemplesEndpoint = new Endpoint({
  path: '/temples',
  method: EndpointMethod.GET,
  handler: getAllTemplesHandler,
  authType: EndpointAuthType.JWT,
  validator: {},
  middleware: [validateCompanySuperAdmin]
});

export const getTempleByIdEndpoint = new Endpoint({
  path: '/temples/:id',
  method: EndpointMethod.GET,
  handler: getTempleByIdHandler,
  authType: EndpointAuthType.JWT,
  validator: {},
  middleware: [validateCompanySuperAdmin]
});

export const updateTempleEndpoint = new Endpoint({
  path: '/temples/:id',
  method: EndpointMethod.PUT,
  handler: updateTempleHandler,
  authType: EndpointAuthType.JWT,
  validator: updateTempleValidator,
  middleware: [validateCompanySuperAdmin]
});

export const updateTempleStatusEndpoint = new Endpoint({
  path: '/temples/:id/status',
  method: EndpointMethod.PATCH,
  handler: updateTempleStatusHandler,
  authType: EndpointAuthType.JWT,
  validator: updateTempleStatusValidator,
  middleware: [validateCompanySuperAdmin]
});

export const deleteTempleEndpoint = new Endpoint({
  path: '/temples/:id',
  method: EndpointMethod.DELETE,
  handler: deleteTempleHandler,
  authType: EndpointAuthType.JWT,
  validator: {},
  middleware: [validateCompanySuperAdmin]
});
