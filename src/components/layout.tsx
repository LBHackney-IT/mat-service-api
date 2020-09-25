import React from 'react';
import {
  Header,
  PhaseBanner,
  Container,
  NavigationBar,
} from 'lbh-frontend-react';

const pageRedirect = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Residents',
    url: `${process.env.NEXT_PUBLIC_SINGLEVIEW_URL}`,
  },
];

interface LayoutProps {
  showNavBar?: boolean;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const feedbackLink = process.env.NEXT_PUBLIC_FEEDBACK_LINK || '';
  const showNavBar = props.showNavBar === undefined ? true : props.showNavBar;

  return (
    <div>
      <Header serviceName="Manage a Tenancy" />
      <Container>
        <PhaseBanner phase="BETA" url={feedbackLink} />
        {showNavBar ? <NavigationBar targets={pageRedirect} /> : null}
        {props.children}
      </Container>
    </div>
  );
};

export default Layout;
