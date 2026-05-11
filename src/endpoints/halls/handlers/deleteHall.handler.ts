import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Hall } from 'db';
import { HALL_NOT_FOUND, DELETE_HALL_ERROR } from '../halls.const';

export const deleteHallHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
) => {
  try {
    const { id } = req.params;

    const hall = await Hall.findByPk(id);

    if (!hall) {
      res.status(404).json({ message: HALL_NOT_FOUND });
      return;
    }

    await hall.destroy();

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_HALL_ERROR });
  }
};
