import React from 'react';
import App from 'next/app'
import cookie from 'cookie';
import isLoggedIn from '../usecases/isLoggedIn';
import { AppProps } from 'next/app';
import '../global.scss';

const unauthenticatedLandingPage = '/login-redirect';

function MaTApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

MaTApp.getInitialProps = async (context: any) => {

  console.log(unauthenticatedLandingPage);

  if (context.ctx.req.headers.cookie) {
    let parsedCookie = cookie.parse(context.ctx.req.headers.cookie);

    console.log(isLoggedIn(parsedCookie.hackneyToken));

    if (
      (parsedCookie &&
        parsedCookie.hackneyToken &&
        isLoggedIn(parsedCookie.hackneyToken) === true) ||
      context.ctx.pathname == unauthenticatedLandingPage
    ) {
      console.log("2");
      const appProps = await App.getInitialProps(context);
      return { ...appProps }
    }
  }

  context.ctx.res.writeHead(302, { Location: unauthenticatedLandingPage });
  context.ctx.res.end();
  return {};
}

export default MaTApp;
