import * as React from 'react';
import Layout from '../../components/layout';
import { Button, Heading, HeadingLevels, Paragraph, Label, Radios } from 'lbh-frontend-react';
import axios from "axios";
import absoluteUrl from "next-absolute-url";

interface TenancyProps {
}

class TenancyPage extends React.Component {

  constructor(props: TenancyProps) {
    super(props);
    this.state = { process: undefined };
  }

  render() {

    return (
      <Layout>
        <Heading level={HeadingLevels.H2}>Create New Process</Heading>
        <Heading level={HeadingLevels.H3}>Tenancy</Heading>
        <Paragraph>
          <Label>Residents:</Label>
          <Label>Tenancy type:</Label>
          <Label>Tenancy start date:</Label>
        </Paragraph>
        <Heading level={HeadingLevels.H3}>Processes</Heading>
        <Radios
          name="processes"
          items={this.itemTypes(this.isCollapsed())}
          onChange={(value: any): void => { this.setState({ process: value }); }}
          required={true} />
        <Button
          className="govuk-button lbh-button"
          onClick={(): void => console.log("on change")}
          disabled={!this.isReadyToSubmit()}>
          Select process
       </Button>
      </Layout>
    );  
  }

  isCollapsed() : boolean {
    return (this.state.process !== "thc");
  }

  isReadyToSubmit() : boolean { 
    return this.state.process && (this.isCollapsed() || this.state.subProcess);
  }

  itemTypes(collapsed: boolean) {

    const children = collapsed ? null : this.thcSubItemTypes();

    return [
      {
        id: "homecheck",
        label: {
          children: "Home Check",
        },
        value: "homecheck"
      },
      {
        id: "itv",
        label: {
          children: "Introductory Tenancy Visit",
        },
        value: "itv"
      },
      {
        id: "thc",
        label: {
          children: "Tenancy & Household Check",
        },
        value: "thc",
        childrenWhenChecked: children
      }
    ];
  }

  thcSubItemTypes() {
    return <>
      <Heading level={HeadingLevels.H4}>What is the reason for doing this Tenancy and Household Check?</Heading>
      <Radios
        name="thcSubProcesses"
        items={[
          {
            id: "thcReason1",
            label: {
              children: "Adverse behaviour about occupants or use of home",
            },
            value: "1"
          },
          {
            id: "thcReason2",
            label: {
              children: "Financial irregularity or fraud investigation",
            },
            value: "2"
          },
          {
            id: "thcReason3",
            label: {
              children: "Gas safety forced entry",
            },
            value: "3"
          },
          {
            id: "thcReason4",
            label: {
              children: "Record of occupancy elsewhere",
            },
            value: "4"
          },
          {
            id: "thcReason5",
            label: {
              children: "Rent concerns (large balance / large debt)",
            },
            value: "5"
          },
          {
            id: "thcReason6",
            label: {
              children: "Repair concerns (too many / too few)",
            },
            value: "6"
          },
          {
            id: "thcReason7",
            label: {
              children: "Right to Buy tenancy verification",
            },
            value: "7"
          },
          {
            id: "thcReason8",
            label: {
              children: "Standard occupancy check",
            },
            value: "8"
          },
          {
            id: "thcReason9",
            label: {
              children: "Tenancy visit for a transfer application",
            },
            value: "9"
          },
          {
            id: "thcReason10",
            label: {
              children: "Vulnerable (elderly / disabled / referral)",
            },
            value: "10"
          }
        ]}
        onChange={(value: any): void => { this.setState({ subProcess: value }); }}
        required={true}
      />
    </>
  }
}

export default TenancyPage;