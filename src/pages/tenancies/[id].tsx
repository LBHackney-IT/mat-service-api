import * as React from 'react';
import Layout from '../../components/layout';
import {
  Heading,
  HeadingLevels,
  List,
  Paragraph,
  Label,
  Button,
} from 'lbh-frontend-react';

const TenancyPage = () => {
  return (
    <Layout>
      <Heading level={HeadingLevels.H2}>1 Hill Street N16 5TT</Heading>
      <Heading level={HeadingLevels.H3}>Tenancy</Heading>
      <Heading level={HeadingLevels.H3}>Area and Patch</Heading>

      <Heading level={HeadingLevels.H3}>Residents</Heading>
      <div>Mrs Joan Fisher</div>
      <div>Mrs Sally Fisher</div>
      <Button>Edit Contact Details</Button>
      <Heading level={HeadingLevels.H3}>Notifications</Heading>
      <div>Name</div>
      <Heading level={HeadingLevels.H3}>Household members</Heading>
      <Heading level={HeadingLevels.H3}>Other information</Heading>
      <Button>Create process</Button>
    </Layout>
  );
};

export default TenancyPage;
