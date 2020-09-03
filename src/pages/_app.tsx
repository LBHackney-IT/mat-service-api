import React from 'react';
import cookie from 'cookie';
import App, { AppProps, AppContext } from 'next/app';
import isLoggedIn from '../usecases/ui/isLoggedIn';
import '../global.scss';
import userMappingExists from '../usecases/ui/userMappingExists';
import getCrmUserGuid from '../usecases/ui/getCrmUserGuid';
import jwt from 'jsonwebtoken';
import createUserMapping, { UserMapping } from '../usecases/ui/createUserMapping';
import createCrmUser from '../usecases/ui/createCrmUser';

const unauthenticatedLandingPage = '/login-redirect';


function MaTApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

MaTApp.getInitialProps = async (context: AppContext) => {

  const appProps = App.getInitialProps(context);

  if (context.ctx &&
    context.ctx.req &&
    context.ctx.req.headers &&
    context.ctx.req.headers.cookie) {
    let parsedCookie = cookie.parse(context.ctx.req.headers.cookie);

    if (
      (parsedCookie &&
        parsedCookie.hackneyToken &&
        isLoggedIn(parsedCookie.hackneyToken) === true)
    ) {
      userMappingManagement(parsedCookie);
      return { ...appProps }
    }
  }

  if (context.ctx &&
    context.ctx.res &&
    context.ctx.pathname !== unauthenticatedLandingPage &&
    !context.ctx.pathname.startsWith('/api')) {
    context.ctx.res.writeHead(302, { Location: unauthenticatedLandingPage });
    context.ctx.res.end();
    return { ...appProps }
  }
  else {
    return { ...appProps }
  }
}

export default MaTApp;

interface HackneyToken {
  sub: string,
  email: string,
  iss: string,
  name: string,
  groups: string[],
  iat: number
}

const userMappingManagement = async (parsedCookie: { [key: string]: string; }) => {
  const hackneyToken = jwt.decode(parsedCookie.hackneyToken) as HackneyToken;
  if (hackneyToken.email) {
    const existingUserMapping = await userMappingExists(hackneyToken.email);
    if (existingUserMapping) {
      return;
    } else {
      const crmUserGuid = await getCrmUserGuid(hackneyToken.email);
      let crmId;
      if (crmUserGuid === undefined) {
        const splitName = hackneyToken.name.split(' ')
        const user = {
          fullName: hackneyToken.name,
          firstName: splitName[0],
          familyName: splitName[splitName.length - 1],
          emailAddress: hackneyToken.email
        }
        crmId = await createCrmUser(user);
      }
      const userMapping: UserMapping = {
        name: hackneyToken.name,
        emailAddress: hackneyToken.email,
        googleId: hackneyToken.iat.toString(),
        usercrmid: crmUserGuid ? crmUserGuid : crmId
      }
      await createUserMapping(userMapping)
    }
  }
}

