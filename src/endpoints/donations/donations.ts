import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';

import {
  addDonationHandler,
  updateDonationHandler,
  deleteDonationHandler,
  getDonationHandler,
  getAllDonationsHandler
} from './handlers';

import {
  addDonationValidator,
  updateDonationValidator,
  emptyValidator
} from './donations.validator';

export const addDonationEndpoint = new Endpoint({
  path: '/donations',
  method: EndpointMethod.POST,
  handler: addDonationHandler,
  authType: EndpointAuthType.NONE,
  validator: addDonationValidator
});

export const updateDonationEndpoint = new Endpoint({
  path: '/donations/:id',
  method: EndpointMethod.PUT,
  handler: updateDonationHandler,
  authType: EndpointAuthType.NONE,
  validator: updateDonationValidator
});

export const deleteDonationEndpoint = new Endpoint({
  path: '/donations/:id',
  method: EndpointMethod.DELETE,
  handler: deleteDonationHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getDonationEndpoint = new Endpoint({
  path: '/donations/:id',
  method: EndpointMethod.GET,
  handler: getDonationHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getAllDonationsEndpoint = new Endpoint({
  path: '/donations',
  method: EndpointMethod.GET,
  handler: getAllDonationsHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
