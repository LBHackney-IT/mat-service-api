import 'jsdom-global/register';
import MaTApp from '../../pages/_app'
require('dotenv').config();

const validToken =
  'hackneyToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImFyZWEtaG91c2luZy1tYW5hZ2VyLWRldiJdLCJpYXQiOjE1OTUzNDMxMTB9.RnwD8lgD6jGBmve3k0O8b6sOqGlInmGrXdg08I9t_9s';

const invalidGroupToken =
  'hackneyToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImludmFsaWQgZ3JvdXAiXSwiaWF0IjoxNTk1MzQzMTEwfQ.S5EXHiUgJY0gKd48PLpmMt4C45DHmxCRwQTm1iq55Zo';

describe('App', () => {
  it("redirects to login redirect page if not already authenticated", () => {

    const req = {
      headers: {
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    MaTApp.getInitialProps({ctx: { req: req, res, pathname: "/" }});

    expect(res.writeHead).toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(302, {"Location": '/login-redirect'});
  });

  it("redirects to login redirect page if authenticated but not in a valid group", () => {

    const req = {
      headers: {
        cookie: invalidGroupToken
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    MaTApp.getInitialProps({ctx: { req: req, res }});

    expect(res.writeHead).toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(302, {"Location": '/login-redirect'});
  });

  it("does not redirect if authenticated and in a valid group", () => {

    const req = {
      headers: {
        cookie: validToken
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    MaTApp.getInitialProps({ctx: { req: req, res }});

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });
});
