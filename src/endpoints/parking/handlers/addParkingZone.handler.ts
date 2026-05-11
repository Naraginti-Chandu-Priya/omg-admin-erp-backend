import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { ParkingZone } from 'db';
import { ADD_PARKING_ZONE_ERROR } from '../parking.const';

export const addParkingZoneHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const zone = await ParkingZone.create(req.body);
    res.status(201).json(zone);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_PARKING_ZONE_ERROR });
  }
};
