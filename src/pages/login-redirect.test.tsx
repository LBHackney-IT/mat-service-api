import 'jsdom-global/register';
import React from 'react';
import LoginRedirectPage, { getServerSideProps } from './login-redirect'
import { mount } from "enzyme";
require('dotenv').config();

const validToken =
  'hackneyToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImFyZWEtaG91c2luZy1tYW5hZ2VyLWRldiJdLCJpYXQiOjE1OTUzNDMxMTB9.RnwD8lgD6jGBmve3k0O8b6sOqGlInmGrXdg08I9t_9s';

const invalidGroupToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImludmFsaWQgZ3JvdXAiXSwiaWF0IjoxNTk1MzQzMTEwfQ.S5EXHiUgJY0gKd48PLpmMt4C45DHmxCRwQTm1iq55Zo';

describe('LoginRedirect', () => {
  it("redirects to home page if already authenticated", async () => {

    const anonymousReq = {
      headers: {
        cookie: validToken
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    await getServerSideProps({ req: anonymousReq, res });

    expect(res.writeHead).toHaveBeenCalledWith(302, {"Location": "/"});
  });

  it("does not redirect to home page if in an invalid group", async () => {

    const anonymousReq = {
      headers: {
        cookie: invalidGroupToken
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    await getServerSideProps({ req: anonymousReq, res });

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });

  it("does not redirect to home page if there is no cookie", async () => {

    const anonymousReq = {
      headers: {
        cookie: undefined
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    await getServerSideProps({ req: anonymousReq, res });

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });

  it('has the correct feedback URI', () => {
    const component = mount(<LoginRedirectPage/>);

    process.env.UI_PATH = 'http://localhost:3000';

    expect(component.find({ 'data-test': 'login-link' }).at(0).props().href).toBe(
      "https://auth.hackney.gov.uk/auth?redirect_uri=http://localhost:3000"
    );
  });
});
