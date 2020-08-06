import React from 'react';
import isLoggedIn from '../usecases/ui/isLoggedIn';
import Layout from '../components/layout';
import { Paragraph, Heading, HeadingLevels, Link } from 'lbh-frontend-react';
import cookie from 'cookie';

const LoginRedirectPage: React.FC = () => {

  return (
    <Layout>
      <div className="lbh-container">
        <div className="loginPage">
          <Heading level={HeadingLevels.H1}>Please log in</Heading>
          <Link
            data-test="login-link"
            href={'https://auth.hackney.gov.uk/auth?redirect_uri=' + process.env.UI_PATH}
          >
            Log in with Google
          </Link>
          <div className="privacy-notice">
            <Heading level={HeadingLevels.H3}>Privacy Notice</Heading>
            <Paragraph>
              We use Google Analytics and Hotjar to collect information about
              how you use this site. We do this to make sure it’s meeting your
              needs and to understand how we can make the website work better.
            </Paragraph>
            <Paragraph>
              Google Analytics stores information about what pages on this site
              you visit, how long you are on the site, how you got here and what
              you click on while you are here.
            </Paragraph>
            <Paragraph>
              Hotjar sets cookies to help us track behaviour across pages and to
              control visitor polls.
            </Paragraph>
          </div>
        </div>
      </div>
    </Layout>
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
