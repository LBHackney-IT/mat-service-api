import cookie from 'cookie';
import { IncomingHttpHeaders } from 'http';

export default (headers: IncomingHttpHeaders): string | undefined => {
  if (headers.cookie) {
    const cookies = cookie.parse(headers.cookie);
    return cookies.hackneyToken;
  }
};
