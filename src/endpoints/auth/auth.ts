import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  loginValidator,
  logoutValidator,
  refreshValidator,
  createPasswordValidator,
  resetPasswordValidator,
  verifyOtpResetPasswordValidator,
  completePasswordResetValidator
} from './auth.validator';
import {
  loginHandler,
  refreshHandler,
  logoutHandler,
  createPasswordHandler,
  resetPasswordHandler,
  verifyOtpResetPasswordHandler,
  completePasswordResetHandler
} from './handlers';

export const loginEndpoint = new Endpoint({
  path: '/auth/login',
  method: EndpointMethod.POST,
  handler: loginHandler,
  authType: EndpointAuthType.NONE,
  validator: loginValidator
});

export const refreshEndpoint = new Endpoint({
  path: '/auth/refresh',
  method: EndpointMethod.POST,
  handler: refreshHandler,
  authType: EndpointAuthType.NONE,
  validator: refreshValidator
});

export const logoutEndpoint = new Endpoint({
  path: '/auth/logout',
  method: EndpointMethod.POST,
  handler: logoutHandler,
  authType: EndpointAuthType.NONE,
  validator: logoutValidator
});

export const createPasswordEndpoint = new Endpoint({
  path: '/auth/create-password',
  method: EndpointMethod.POST,
  handler: createPasswordHandler,
  authType: EndpointAuthType.NONE,
  validator: createPasswordValidator
});

export const resetPasswordEndpoint = new Endpoint({
  path: '/auth/forgot-password',
  method: EndpointMethod.POST,
  handler: resetPasswordHandler,
  authType: EndpointAuthType.NONE,
  validator: resetPasswordValidator
});

export const verifyOtpResetPasswordEndpoint = new Endpoint({
  path: '/auth/forgot-password/verify',
  method: EndpointMethod.POST,
  handler: verifyOtpResetPasswordHandler,
  authType: EndpointAuthType.NONE,
  validator: verifyOtpResetPasswordValidator
});

export const completePasswordResetEndpoint = new Endpoint({
  path: '/auth/forgot-password/reset',
  method: EndpointMethod.POST,
  handler: completePasswordResetHandler,
  authType: EndpointAuthType.NONE,
  validator: completePasswordResetValidator
});
