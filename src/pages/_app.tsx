import React from 'react';
import App from 'next/app'
import cookie from 'cookie';
import isLoggedIn from '../usecases/isLoggedIn';
import { AppProps } from 'next/app';
import '../global.scss';

//const unauthenticatedLandingPage = '/login-redirect';
const unauthenticatedLandingPage = process.env.LOGIN_PAGE;

function MaTApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

MaTApp.getInitialProps = async (context: any) => {

  if (context.ctx.req.headers.cookie) {
    let parsedCookie = cookie.parse(context.ctx.req.headers.cookie);

    if (
      (parsedCookie &&
        parsedCookie.hackneyToken &&
        isLoggedIn(parsedCookie.hackneyToken) === true) ||
      context.ctx.pathname == unauthenticatedLandingPage
    ) {
      const appProps = await App.getInitialProps(context);
      return { ...appProps }
    }
    else {
      context.ctx.res.writeHead(302, { Location: unauthenticatedLandingPage });
      context.ctx.res.end();
      return {};
    }
  }
}

export default MaTApp;
