import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  getRevenueLedgerHandler,
  getRevenueSummaryHandler,
  getRevenueTrendHandler,
  getRevenueByHallHandler
} from './handlers';

export const revenueLedgerEndpoint = new Endpoint({
  path: '/revenue/ledger',
  method: EndpointMethod.POST,
  handler: getRevenueLedgerHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const revenueSummaryEndpoint = new Endpoint({
  path: '/revenue/summary',
  method: EndpointMethod.GET,
  handler: getRevenueSummaryHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const revenueTrendEndpoint = new Endpoint({
  path: '/revenue/trend',
  method: EndpointMethod.POST,
  handler: getRevenueTrendHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const revenueByHallEndpoint = new Endpoint({
  path: '/revenue/by-hall',
  method: EndpointMethod.GET,
  handler: getRevenueByHallHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});
