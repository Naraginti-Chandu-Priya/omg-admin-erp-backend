import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import {
  addParkingZoneHandler,
  deleteParkingZoneHandler,
  captureParkingEntryHandler,
  getAllParkingEntriesHandler
} from './handlers';
import {
  addParkingZoneValidator,
  captureParkingEntryValidator
} from './parking.validator';

export const addParkingZoneEndpoint = new Endpoint({
  path: '/parking/zones',
  method: EndpointMethod.POST,
  handler: addParkingZoneHandler,
  authType: EndpointAuthType.NONE,
  validator: addParkingZoneValidator
});

export const deleteParkingZoneEndpoint = new Endpoint({
  path: '/parking/zones/:id',
  method: EndpointMethod.DELETE,
  handler: deleteParkingZoneHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const captureParkingEntryEndpoint = new Endpoint({
  path: '/parking/entries',
  method: EndpointMethod.POST,
  handler: captureParkingEntryHandler,
  authType: EndpointAuthType.NONE,
  validator: captureParkingEntryValidator
});

export const getAllParkingEntriesEndpoint = new Endpoint({
  path: '/parking/entries',
  method: EndpointMethod.GET,
  handler: getAllParkingEntriesHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});
