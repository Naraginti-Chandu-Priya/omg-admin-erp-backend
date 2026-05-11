import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { ParkingZone } from 'db';
import { DELETE_PARKING_ZONE_ERROR } from '../parking.const';

export const deleteParkingZoneHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await ParkingZone.destroy({ where: { id } });
    if (deletedCount === 0) {
      res.status(404).json({ message: 'Zone not found' });
      return;
    }
    res.status(200).json({ message: 'Parking zone deleted successfully' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_PARKING_ZONE_ERROR });
  }
};
