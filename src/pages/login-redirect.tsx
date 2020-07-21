import React from 'react';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../usecases/isLoggedIn';
import { useRouter } from 'next/router';

const LoginRedirectPage = () => {
  // document.title = 'Login - Manage A Tenancy';
  // Needs to be moved to a parent layout component;
  if (isLoggedIn() === true) {
    return <Redirect to="/" />;
  }

  // const redirect_uri = `${window.location.protocol}//${window.location.host}`;
  const router = useRouter();
  const redirect_uri = process.env.UI_PATH + router.pathname;

  return (
    <div className="lbh-container">
      <div className="loginPage">
        <h1>Please log in</h1>
        <a
          href={`https://auth.hackney.gov.uk/auth?redirect_uri=${redirect_uri}`}
        >
          Log in with Google
        </a>
        <div className="privacy-notice">
          <h3>Privacy Notice</h3>
          <p>
            We use Google Analytics and Hotjar to collect information about
            how you use this site. We do this to make sure it’s meeting your
            needs and to understand how we can make the website work better.
          </p>
          <p>
            Google Analytics stores information about what pages on this site
            you visit, how long you are on the site, how you got here and what
            you click on while you are here.
          </p>
          <p>
            Hotjar sets cookies to help us track behaviour across pages and to
            control visitor polls.
          </p>
        </div>
      </div>
    </div>
  );
}

  export default LoginRedirectPage