import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  getAllAssetsHandler,
  getAssetByIdHandler,
  createAssetHandler,
  updateAssetHandler,
  deleteAssetHandler
} from './handlers';

export const assetsListEndpoint = new Endpoint({
  path: '/assets',
  method: EndpointMethod.GET,
  handler: getAllAssetsHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const assetsByIdEndpoint = new Endpoint({
  path: '/assets/:id',
  method: EndpointMethod.GET,
  handler: getAssetByIdHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const assetsCreateEndpoint = new Endpoint({
  path: '/assets',
  method: EndpointMethod.POST,
  handler: createAssetHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const assetsUpdateEndpoint = new Endpoint({
  path: '/assets/:id',
  method: EndpointMethod.PUT,
  handler: updateAssetHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const assetsDeleteEndpoint = new Endpoint({
  path: '/assets/:id',
  method: EndpointMethod.DELETE,
  handler: deleteAssetHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});
