import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import {
  mfaSetupValidator,
  mfaConfirmValidator,
  mfaVerifyValidator
} from './mfa.validator';
import { mfaConfirmHandler } from './handlers/mfa_confirm.handler';
import { mfaSetupHandler } from './handlers/mfa_setup.handler';
import { mfaVerifyHandler } from './handlers/mfa_verify.handler';

export const mfaSetupEndpoint = new Endpoint({
  path: '/auth/mfa/setup',
  method: EndpointMethod.POST,
  handler: mfaSetupHandler,
  authType: EndpointAuthType.NONE,
  validator: mfaSetupValidator
});

export const mfaConfirmEndpoint = new Endpoint({
  path: '/auth/mfa/confirm',
  method: EndpointMethod.POST,
  handler: mfaConfirmHandler,
  authType: EndpointAuthType.NONE,
  validator: mfaConfirmValidator
});

export const mfaVerifyEndpoint = new Endpoint({
  path: '/auth/mfa/verify',
  method: EndpointMethod.POST,
  handler: mfaVerifyHandler,
  authType: EndpointAuthType.NONE,
  validator: mfaVerifyValidator
});
