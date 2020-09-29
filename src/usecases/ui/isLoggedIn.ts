import jwt from 'jsonwebtoken';
import HackneyToken from '../../interfaces/hackneyToken';

const isLoggedIn = (token: string | undefined): boolean => {
  if (process.env.ALLOWED_GROUPS === undefined) {
    return false;
  }
  const allowedGroups = process.env.ALLOWED_GROUPS.split(',');

  if (!token) return false;

  const payload = jwt.decode(token);

  if (!allowedGroups || !payload) return false;
  const hackneyToken = payload as HackneyToken;

  return (
    hackneyToken.groups &&
    hackneyToken.groups.some((g: string) => allowedGroups.includes(g))
  );
};

export default isLoggedIn;
