import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const tokenName = 'hackneyToken';
const allowedGroups = process.env.ALLOWED_GROUPS?.split(',');

const isLoggedIn = (): boolean => {
  const token = Cookies.get(tokenName);
  console.log(token);

  if (!token) return false;

  const payload: any = jwt.decode(token);
  console.log(payload);

  if (allowedGroups === undefined) {
    return false;
  }

  return (
    payload &&
    payload.groups &&
    payload.groups.some((g: string) => allowedGroups.includes(g))
  );
};

export default isLoggedIn;
