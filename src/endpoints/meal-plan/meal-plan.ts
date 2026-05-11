import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  addMealPlanHandler,
  getMealPlansHandler,
  getMealPlanHandler,
  updateMealPlanHandler,
  deleteMealPlanHandler
} from './meal-plan.handler';

const emptyValidator = {};

export const addMealPlanEndpoint = new Endpoint({
  path: '/annathanam',
  method: EndpointMethod.POST,
  handler: addMealPlanHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getMealPlansEndpoint = new Endpoint({
  path: '/annathanam',
  method: EndpointMethod.GET,
  handler: getMealPlansHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const getMealPlanEndpoint = new Endpoint({
  path: '/annathanam/:id',
  method: EndpointMethod.GET,
  handler: getMealPlanHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const updateMealPlanEndpoint = new Endpoint({
  path: '/annathanam/:id',
  method: EndpointMethod.PUT,
  handler: updateMealPlanHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});

export const deleteMealPlanEndpoint = new Endpoint({
  path: '/annathanam/:id',
  method: EndpointMethod.DELETE,
  handler: deleteMealPlanHandler,
  authType: EndpointAuthType.NONE,
  validator: emptyValidator
});
