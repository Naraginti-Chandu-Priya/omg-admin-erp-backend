import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  addProcurementHandler,
  getProcurementsHandler,
  getProcurementHandler,
  updateProcurementHandler,
  deleteProcurementHandler
} from './procurement.handler';

const emptyValidator = {};

export const addProcurementEndpoint = new Endpoint({
  path: '/procurement',
  method: EndpointMethod.POST,
  handler: addProcurementHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getProcurementsEndpoint = new Endpoint({
  path: '/procurement',
  method: EndpointMethod.GET,
  handler: getProcurementsHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getProcurementEndpoint = new Endpoint({
  path: '/procurement/:id',
  method: EndpointMethod.GET,
  handler: getProcurementHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updateProcurementEndpoint = new Endpoint({
  path: '/procurement/:id',
  method: EndpointMethod.PUT,
  handler: updateProcurementHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const deleteProcurementEndpoint = new Endpoint({
  path: '/procurement/:id',
  method: EndpointMethod.DELETE,
  handler: deleteProcurementHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
