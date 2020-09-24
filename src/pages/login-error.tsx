import React from 'react';
import Layout from '../components/layout';
import { Paragraph, Heading, HeadingLevels } from 'lbh-frontend-react';

const LoginErrorPage: React.FC = () => {
  return (
    <Layout showNavBar={false}>
      <div className="lbh-container">
        <div className="loginPage">
          <Heading level={HeadingLevels.H1}>Problem logging in</Heading>
          <Paragraph>
            Please ensure you are in the correct Google Group and that you have
            been assigned to a patch.
          </Paragraph>
          <Paragraph>
            Please contact your manager who will be able to set this up for you.
          </Paragraph>
        </div>
      </div>
    </Layout>
  );
};

export default LoginErrorPage;
