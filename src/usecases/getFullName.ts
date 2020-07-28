import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const tokenName = 'hackneyToken';

const getFullName = (): string | undefined => {
  const token = Cookies.get(tokenName);
  if (!token) return undefined;

  const decoded: any = jwt.decode(token);
  return decoded ? decoded.name : undefined;
};

export default getFullName;