import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Asset } from 'db';
import { ASSETS_ERRORS } from '../assets.const';

export const updateAssetHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const { id } = req.params as Record<string, string>;
    const {
      assetCode,
      name,
      category,
      purchaseDate,
      condition,
      maintenanceStatus,
      notes
    } = req.body as Record<string, unknown>;

    const asset = await Asset.findByPk(id);

    if (!asset) {
      res.status(404).json({ error: ASSETS_ERRORS.NOT_FOUND });
      return;
    }

    const updateData: Record<string, unknown> = {};

    if (assetCode) updateData.assetCode = String(assetCode);
    if (name) updateData.name = String(name);
    if (category) updateData.category = String(category);
    if (purchaseDate) updateData.purchaseDate = new Date(String(purchaseDate));
    if (condition) updateData.condition = String(condition);
    if (maintenanceStatus)
      updateData.maintenanceStatus = String(maintenanceStatus);
    if (notes) updateData.notes = String(notes);

    await asset.update(updateData);

    res.json({ data: asset });
  } catch (error) {
    reportError(error);
    res.status(500).json({ error: ASSETS_ERRORS.UPDATE });
  }
};
