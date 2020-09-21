import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import HackneyToken from '../../interfaces/hackneyToken';

const getTokenPayload = (token: string): HackneyToken | null => {
  return jwt.decode(token) as HackneyToken;
};

export function getTokenPayloadFromRequest(
  req: NextApiRequest
): HackneyToken | null {
  if (req.cookies && req.cookies.hackneyToken) {
    return getTokenPayload(req.cookies.hackneyToken);
  }
  return null;
}
export default getTokenPayload;
