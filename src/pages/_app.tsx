import React from 'react';
import cookie from 'cookie';
import App, { AppProps, AppContext } from 'next/app';
import isLoggedIn from '../usecases/ui/isLoggedIn';
import '../global.scss';

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

      return { ...appProps }
    }
  }

  if (context.ctx &&
    context.ctx.res &&
    context.ctx.pathname !== unauthenticatedLandingPage &&
    !context.ctx.pathname.startsWith('/api')) {
    console.log("No valid token - redirecting from " + context.ctx.pathname);
    context.ctx.res.writeHead(302, { Location: unauthenticatedLandingPage });
    context.ctx.res.end();
    return { ...appProps }
  }
  else {
    return { ...appProps }
  }
}

export default MaTApp;
