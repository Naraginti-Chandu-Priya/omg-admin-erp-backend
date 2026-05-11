import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { sendMail } from 'utils/mailer';
import {
  COMMUNICATION_CHANNEL_UNAUTHORIZED,
  COMMUNICATION_CHANNEL_INVALID_PAYLOAD,
  COMMUNICATION_CHANNEL_SEND_FAILED
} from './communicationChannel.const';

export const communicationChannelHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: COMMUNICATION_CHANNEL_UNAUTHORIZED });
    return;
  }

  const { to, subject, body } = req.body as {
    to?: string;
    subject?: string;
    body?: string;
  };

  if (!to || !subject || !body) {
    res.status(400).json({ message: COMMUNICATION_CHANNEL_INVALID_PAYLOAD });
    return;
  }

  try {
    const sent = await sendMail({
      to,
      subject,
      text: body
    });

    if (!sent) {
      res.status(502).json({ message: COMMUNICATION_CHANNEL_SEND_FAILED });
      return;
    }

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: COMMUNICATION_CHANNEL_SEND_FAILED });
  }
};
