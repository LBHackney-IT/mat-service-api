import { NextApiRequest } from 'next';
import { v1MatAPIGateway } from '../../gateways';
import { ApiResponse, ContactList } from '../../interfaces/apiResponses';
import v1ApiContactToContact from '../../mappings/v1ApiContactToContact';

export default async (
  req: NextApiRequest,
  res: ApiResponse<ContactList>
): Promise<void> => {
  const uprn = req.query.uprn
    ? Array.isArray(req.query.uprn)
      ? req.query.uprn[0]
      : req.query.uprn
    : undefined;

  if (!uprn) return res.status(400).json({ error: 'UPRN missing' });
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).json({ error: 'Missing v1 api configuration' });
  }

  const response = await v1MatAPIGateway.getContactsByUprn(uprn);

  if (response.body) {
    res
      .status(200)
      .json({ contacts: response.body.map(v1ApiContactToContact) });
  } else {
    res.status(500).json({ error: 'Could not retrieve contacts' });
  }
};
