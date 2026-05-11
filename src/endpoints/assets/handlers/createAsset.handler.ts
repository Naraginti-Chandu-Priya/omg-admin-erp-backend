import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { customAlphabet } from 'nanoid';
import { Asset } from 'db';
import { ASSETS_ERRORS } from '../assets.const';

const generateAssetCode = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  8
);

export const createAssetHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const {
      name,
      category,
      purchaseDate,
      condition,
      maintenanceStatus,
      notes
    } = req.body as Record<string, unknown>;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const assetCode = `AST-${generateAssetCode()}`;

    const asset = await Asset.create({
      assetCode,
      name: String(name),
      category: category ? String(category) : undefined,
      purchaseDate: purchaseDate ? new Date(String(purchaseDate)) : new Date(),
      condition: condition ? String(condition) : 'Good',
      maintenanceStatus: maintenanceStatus
        ? String(maintenanceStatus)
        : 'Up to Date',
      notes: notes ? String(notes) : undefined
    });

    res.status(201).json({ data: asset });
  } catch (error) {
    reportError(error);
    res.status(500).json({ error: ASSETS_ERRORS.CREATE });
  }
};
