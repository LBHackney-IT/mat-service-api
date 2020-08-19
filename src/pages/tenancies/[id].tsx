import * as React from 'react';
import Layout from '../../components/layout';
import {
  Heading,
  HeadingLevels,
  List,
  Paragraph,
  Label,
  Button,
  NavigationBar,
} from 'lbh-frontend-react';

const TenancyPage = () => {
  return (
    <Layout>
      <Heading level={HeadingLevels.H2}>1 Hill Street N16 5TT</Heading>
      <Heading level={HeadingLevels.H3}>Tenancy</Heading>
      <Paragraph>Tenancy type: secure</Paragraph>
      <Paragraph>Tenancy start date: 01/04/1992</Paragraph>
      <Paragraph>Tenancy reference: 012345678</Paragraph>

      <Heading level={HeadingLevels.H3}>Residents</Heading>
      <div>Mrs Joan Fisher</div>
      <div>Mrs Sally Fisher</div>
      <Paragraph>Date of birth:</Paragraph>
      <Paragraph>Mobile:</Paragraph>
      <Paragraph>Home:</Paragraph>
      <Paragraph>Work:</Paragraph>
      <Paragraph>Email:</Paragraph>
    </Layout>
  );
};

export default TenancyPage;
