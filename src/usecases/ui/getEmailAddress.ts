import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const tokenName = 'hackneyToken';

const getEmailAddress = (): string | undefined => {
  const token = Cookies.get(tokenName);
  if (!token) return undefined;

  const decoded: any = jwt.decode(token);
  return decoded ? decoded.email : undefined;
};

export default getEmailAddress;