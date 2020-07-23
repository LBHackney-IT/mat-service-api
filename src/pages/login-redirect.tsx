import React from 'react';
import isLoggedIn from '../usecases/isLoggedIn';
import { Header } from 'lbh-frontend-react';
import cookie from 'cookie';

const LoginRedirectPage = () => {
  // document.title = 'Login - Manage A Tenancy';
  // Needs to be moved to a parent layout component;

  // const uiPath = process.env.UI_PATH;

  return (
    <div>
      <Header serviceName="Manage A Tenancy" />
      <div className="lbh-container">
        <div className="loginPage">
          <h1>Please log in</h1>
          <a
            data-test="login-link"
            href={`https://auth.hackney.gov.uk/auth?redirect_uri=http://localhost:3000`}
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

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export function getServerSideProps(context: any) {
  if (context.req.headers.cookie) {
    let parsedCookie = cookie.parse(context.req.headers.cookie);

    if (
      parsedCookie &&
      parsedCookie.hackneyToken &&
      isLoggedIn(parsedCookie.hackneyToken) === true
    ) {
      context.res.writeHead(302, { Location: '/' });
      context.res.end();
    }
  }

  return { props: {} };
}

export default LoginRedirectPage;
