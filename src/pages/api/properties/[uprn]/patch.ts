import { NextApiRequest } from 'next';
import { crmGateway } from '../../../../gateways';
import { ApiResponse } from '../../../../interfaces/apiResponses';
import { PropertyPatchDetails } from '../../../../interfaces/propertyPatchDetails';

export default async (
  req: NextApiRequest,
  res: ApiResponse<PropertyPatchDetails>
): Promise<void> => {
  const uprn = req.query.uprn
    ? Array.isArray(req.query.uprn)
      ? req.query.uprn[0]
      : req.query.uprn
    : undefined;

  if (!uprn) return res.status(400).json({ error: 'UPRN missing' });
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).end();
  }

  const response = await crmGateway.getPropertyPatch(uprn);

  if (response.body) {
    res.status(200).json(response.body);
  } else {
    res.status(500).json({ error: 'Could not retrieve property patch' });
  }
};
