import React from 'react';
import cookie from 'cookie';
import App, { AppProps, AppContext } from 'next/app';
import isLoggedIn from '../usecases/ui/isLoggedIn';
import '../global.scss';
import userMappingExists from '../usecases/ui/userMappingExists';
import getCrmUserGuid from '../usecases/ui/getCrmUserGuid';
import jwt from 'jsonwebtoken';
import createUserMapping, {
  UserMapping,
} from '../usecases/ui/createUserMapping';
import createCrmUser from '../usecases/ui/createCrmUser';

const unauthenticatedLandingPage = '/login-redirect';

function MaTApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

MaTApp.getInitialProps = async (context: AppContext) => {
  console.log('Calling GetInitialProps on main app');
  const appProps = App.getInitialProps(context);
  try {
    if (
      context.ctx &&
      context.ctx.req &&
      context.ctx.req.headers &&
      context.ctx.req.headers.cookie
    ) {
      let parsedCookie = cookie.parse(context.ctx.req.headers.cookie);

      if (
        parsedCookie &&
        parsedCookie.hackneyToken &&
        isLoggedIn(parsedCookie.hackneyToken) === true
      ) {
        console.log('Calling userMappingManagement from GetInitialProps');
        userMappingManagement(parsedCookie);
        return { ...appProps };
      }
    }

    if (
      context.ctx &&
      context.ctx.res &&
      context.ctx.pathname !== unauthenticatedLandingPage &&
      !context.ctx.pathname.startsWith('/api')
    ) {
      console.log('No valid token - redirecting from ' + context.ctx.pathname);
      context.ctx.res.writeHead(302, { Location: unauthenticatedLandingPage });
      context.ctx.res.end();
      return { ...appProps };
    } else {
      return { ...appProps };
    }
  } catch (e) {
    console.log('Error in GetInitialProps', e);
  }
};

export default MaTApp;

interface HackneyToken {
  sub: string;
  email: string;
  iss: string;
  name: string;
  groups: string[];
  iat: number;
}

const userMappingManagement = async (parsedCookie: {
  [key: string]: string;
}) => {
  console.log('Calling userMappingManagement on main app');
  const hackneyToken = jwt.decode(parsedCookie.hackneyToken) as HackneyToken;
  if (hackneyToken.email) {
    const existingUserMapping = await userMappingExists(hackneyToken.email);
    if (existingUserMapping) {
      console.log('userMappingManagement: user already exists');
      return;
    } else {
      const crmUserGuid = await getCrmUserGuid(hackneyToken.email);
      console.log('crmUserGuid:', crmUserGuid);
      let crmId;
      if (crmUserGuid === undefined) {
        const splitName = hackneyToken.name.split(' ');
        const user = {
          fullName: hackneyToken.name,
          firstName: splitName[0],
          familyName: splitName[splitName.length - 1],
          emailAddress: hackneyToken.email,
        };
        crmId = await createCrmUser(user);
      }
      const userMapping: UserMapping = {
        name: hackneyToken.name,
        emailAddress: hackneyToken.email,
        googleId: hackneyToken.iat.toString(),
        usercrmid: crmUserGuid ? crmUserGuid.data : crmId,
      };
      await createUserMapping(userMapping);
    }
  }
};
