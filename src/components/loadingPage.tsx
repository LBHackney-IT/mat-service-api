import React, { ReactNode } from 'react';
import Layout from './layout';
import { Heading, HeadingLevels } from 'lbh-frontend-react';

type LoadingPageProps = {
  error?: boolean;
  children?: ReactNode;
};

const LoadingPage: React.FC<LoadingPageProps> = (props: LoadingPageProps) => {
  const title = props.error ? 'Error loading data' : 'Loading data';
  return (
    <Layout>
      <Heading level={HeadingLevels.H2}>{title}</Heading>
    </Layout>
  );
};

export default LoadingPage;
