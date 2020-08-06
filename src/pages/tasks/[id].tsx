import * as React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout';
import { Paragraph, Heading, HeadingLevels, Link } from 'lbh-frontend-react';

export default function Task() {
  return (
    <Layout>
      <div className="lbh-container">
        <div className="loginPage">
          <Heading level={HeadingLevels.H1}>Please log in</Heading>
          <Link
            data-test="login-link"
            href={
              'https://auth.hackney.gov.uk/auth?redirect_uri=' +
              process.env.UI_PATH
            }
          >
            Log in with Google
          </Link>
        </div>
      </div>
    </Layout>
  );
}
