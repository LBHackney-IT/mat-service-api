import { NextApiRequest, NextApiResponse } from 'next';
import V1MatAPIGateway from '../../gateways/v1MatAPIGateway';
import v1ApiContactToContact from '../../mappings/v1ApiContactToContact';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const uprn = req.query.uprn
    ? Array.isArray(req.query.uprn)
      ? req.query.uprn[0]
      : req.query.uprn
    : undefined;

  if (!uprn) return res.status(400).json({ error: 'UPRN missing' });
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).end();
  }

  const gateway: V1MatAPIGateway = new V1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });

  const response = await gateway.getContactsByUprn(uprn);

  if (response.body) {
    res
      .status(200)
      .json({ contacts: response.body.map(v1ApiContactToContact) });
  } else {
    res.status(500).json({ error: 'Could not retrieve contacts' });
  }
};
