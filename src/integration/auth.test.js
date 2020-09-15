import fetch from 'node-fetch';
import generateToken from '../tests/helpers/generateToken';
require('dotenv').config();

const apiPath = process.env.INTEGRATION_TEST_API_PATH + '/healthcheck';
const jwtSecret = process.env.JWT_SECRET;

describe('authentication and authorisation', () => {
  it(`fails when the user is not authenticated`, async () => {
    let response = await fetch(apiPath, {
      method: 'GET',
    }).then(async (res) => {
      const body = await res.arrayBuffer();
      return {
        status: res.status,
        headers: res.headers,
        body,
      };
    });

    expect(response.status).toEqual(403);
  });

  it(`fails when the user is authenticated and belongs to no groups`, async () => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      [],
      jwtSecret
    );

    let response = await fetch(apiPath, {
      method: 'GET',
      headers: {
        cookie: 'hackneyToken=' + token,
      },
      credentials: 'include',
    }).then(async (res) => {
      const body = await res.arrayBuffer();
      return {
        status: res.status,
        headers: res.headers,
        body,
      };
    });

    expect(response.status).toEqual(403);
  });

  it(`succeeds when the user is authenticated and belongs to the housing-officer-dev group`, async () => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );

    let response = await fetch(apiPath, {
      method: 'GET',
      headers: {
        cookie: 'hackneyToken=' + token,
      },
      credentials: 'include',
    }).then(async (res) => {
      const body = await res.arrayBuffer();
      return {
        status: res.status,
        headers: res.headers,
        body,
      };
    });

    expect(response.status).toEqual(200);
  });

  it(`succeeds when the user is authenticated and belongs to the area-housing-manager-dev group`, async () => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['area-housing-manager-dev'],
      jwtSecret
    );

    let response = await fetch(apiPath, {
      method: 'GET',
      headers: {
        cookie: 'hackneyToken=' + token,
      },
      credentials: 'include',
    }).then(async (res) => {
      const body = await res.arrayBuffer();
      return {
        status: res.status,
        headers: res.headers,
        body,
      };
    });

    expect(response.status).toEqual(200);
  });
});
