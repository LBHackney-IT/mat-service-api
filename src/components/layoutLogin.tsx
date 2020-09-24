import React from 'react';
import { Header, PhaseBanner, Container } from 'lbh-frontend-react';

const Layout: React.FC = (props: any) => {
  const feedbackLink = process.env.NEXT_PUBLIC_FEEDBACK_LINK
    ? process.env.NEXT_PUBLIC_FEEDBACK_LINK
    : '';

  return (
    <div>
      <Header serviceName="Manage a Tenancy" />
      <Container>
        <PhaseBanner phase="BETA" url={feedbackLink} />
      </Container>
    </div>
  );
};

export default Layout;
