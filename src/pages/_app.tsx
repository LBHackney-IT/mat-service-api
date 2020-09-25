import React from 'react';
import cookie from 'cookie';
import App, { AppProps, AppContext } from 'next/app';
import isLoggedIn from '../usecases/ui/isLoggedIn';
import '../global.scss';
import { ServerResponse } from 'http';

const unauthenticatedLandingPage = '/login-redirect';
const unauthenticatedErrorPage = '/login-error';

function MaTApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

const redirect = (res: ServerResponse) => {
  res.writeHead(302, { Location: unauthenticatedLandingPage });
  res.end();
};

MaTApp.getInitialProps = async (context: AppContext) => {
  const appProps = App.getInitialProps(context);

  if (!context.ctx || !context.ctx.req || !context.ctx.res) {
    return { ...appProps };
  }

  if (
    context.ctx.pathname === unauthenticatedLandingPage ||
    context.ctx.pathname.startsWith('/api') ||
    context.ctx.pathname === unauthenticatedErrorPage
  ) {
    return { ...appProps };
  }

  if (context.ctx.req.headers && context.ctx.req.headers.cookie) {
    let parsedCookie = cookie.parse(context.ctx.req.headers.cookie);

    if (
      !parsedCookie ||
      !parsedCookie.hackneyToken ||
      !isLoggedIn(parsedCookie.hackneyToken)
    ) {
      return redirect(context.ctx.res);
    } else {
      return { ...appProps };
    }
  }
  return redirect(context.ctx.res);
};

export default MaTApp;
