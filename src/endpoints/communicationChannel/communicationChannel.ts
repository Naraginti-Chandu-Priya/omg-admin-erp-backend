import { Endpoint, EndpointAuthType, EndpointMethod } from 'node-server-engine';
import { communicationChannelHandler } from './communicationChannel.handler';
import { communicationChannelValidator } from './communicationChannel.validator';

export const communicationChannelEndpoint = new Endpoint({
  path: '/communication-channel',
  method: EndpointMethod.POST,
  handler: communicationChannelHandler,
  authType: EndpointAuthType.NONE,
  validator: communicationChannelValidator
});
