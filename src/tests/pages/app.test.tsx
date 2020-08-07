import 'jsdom-global/register';
import MaTApp from '../../pages/_app'
import generateToken from '../helpers/generateToken'
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET ? process.env.JWT_SECRET : "secret";
const allowedGroups = process.env.ALLOWED_GROUPS ? process.env.ALLOWED_GROUPS.split(',') : [];

describe('App', () => {
  it("redirects to login redirect page if not already authenticated", async () => {

    const req = {
      headers: {
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    expect.assertions(2);
    
    await MaTApp.getInitialProps({ctx: { req, res, pathname: "/" }});

    expect(res.writeHead).toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(302, {"Location": '/login-redirect'});
  });

  it("redirects to login redirect page if authenticated but not in a valid group", async () => {

    let token = generateToken(
			"108854273331484808552",
			"Test User",
			"test.user@hackney.gov.uk",
			["invalid-group"],
      jwtSecret);
      
    const req = {
      headers: {
        cookie: 'hackneyToken=' + token
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    expect.assertions(2);

    await MaTApp.getInitialProps({ctx: { req, res, pathname: "/" }});

    expect(res.writeHead).toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(302, {"Location": '/login-redirect'});
  });

  it("does not redirect if authenticated and in a valid group", async () => {

    let token = generateToken(
			"108854273331484808552",
			"Test User",
			"test.user@hackney.gov.uk",
			allowedGroups,
      jwtSecret);

    const req = {
      headers: {
        cookie: 'hackneyToken=' + token
      },
    };

    let res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn()
    };

    expect.assertions(1);

    await MaTApp.getInitialProps({ctx: { req, res }});

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });
});
