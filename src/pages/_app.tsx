import React from 'react';
import App from 'next/app'
import cookie from 'cookie';
import isLoggedIn from '../usecases/isLoggedIn';
import { AppProps } from 'next/app';
import '../global.scss';

function MaTApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

MaTApp.getInitialProps = async (context: any) => {

  if (context.ctx.req.headers.cookie) {
    let parsedCookie = cookie.parse(context.ctx.req.headers.cookie);

    if (
      parsedCookie &&
      parsedCookie.hackneyToken &&
      isLoggedIn(parsedCookie.hackneyToken) === true ||
      context.ctx.pathname == '/login-redirect'
    ) {
      const appProps = await App.getInitialProps(context);
      return { ...appProps }
    }
    else {
      console.log("redirect")
      context.ctx.res.writeHead(302, { Location: '/login-redirect' });
      context.ctx.res.end();
      return {};
    }
  }
}

export default MaTApp;
