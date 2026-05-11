import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { ParkingEntry, ParkingZone } from 'db';
import { CAPTURE_PARKING_ENTRY_ERROR } from '../parking.const';

export const captureParkingEntryHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const { parking_zone_id, licensePlate, duration } = req.body;

    const zone = await ParkingZone.findByPk(parking_zone_id);
    if (!zone) {
      res.status(404).json({ message: 'Zone not found' });
      return;
    }

    const entry = await ParkingEntry.create({
      parking_zone_id,
      licensePlate,
      duration: duration || new Date()
    });

    res.status(201).json(entry);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: CAPTURE_PARKING_ENTRY_ERROR });
  }
};
