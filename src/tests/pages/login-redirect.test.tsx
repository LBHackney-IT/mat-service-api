import 'jsdom-global/register';
import React from 'react';
import LoginRedirectPage, { getServerSideProps } from '../../pages/login-redirect'
import generateToken from '../helpers/generateToken'
import { mount } from "enzyme";
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET ? process.env.JWT_SECRET : "secret";
const allowedGroups = process.env.ALLOWED_GROUPS ? process.env.ALLOWED_GROUPS.split(',') : [];

describe('LoginRedirect', () => {
  it("redirects to home page if already authenticated", () => {

    let token = generateToken(
			"108854273331484808552",
			"Test User",
			"test.user@hackney.gov.uk",
			allowedGroups,
      jwtSecret);

    const anonymousReq = {
      headers: {
        cookie: 'hackneyToken=' + token
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    getServerSideProps({ req: anonymousReq, res });

    expect(res.writeHead).toHaveBeenCalledWith(302, {"Location": "/"});
  });

  it("does not redirect to home page if in an invalid group", () => {

    let token = generateToken(
			"108854273331484808552",
			"Test User",
			"test.user@hackney.gov.uk",
			['invalid-group'],
      jwtSecret);

    const anonymousReq = {
      headers: {
        cookie: 'hackneyToken=' + token
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    getServerSideProps({ req: anonymousReq, res });

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });

  it("does not redirect to home page if there is no cookie", () => {

    const anonymousReq = {
      headers: {
        cookie: undefined
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    getServerSideProps({ req: anonymousReq, res });

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
