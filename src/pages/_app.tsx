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

  if (context.ctx.req.headers.cookie) {
    let parsedCookie = cookie.parse(context.ctx.req.headers.cookie);

    if (
      (parsedCookie &&
        parsedCookie.hackneyToken &&
        isLoggedIn(parsedCookie.hackneyToken) === true) 
    ) {
      const appProps = await App.getInitialProps(context);
      return { ...appProps }
    }
  }

  if(context.ctx.pathname !== unauthenticatedLandingPage)
  {
    context.ctx.res.writeHead(302, { Location: unauthenticatedLandingPage });
    context.ctx.res.end();
    const appProps = await App.getInitialProps(context);
    return { ...appProps }
  }
  else{
    const appProps = await App.getInitialProps(context);
    return { ...appProps }
  }
}

export default MaTApp;
