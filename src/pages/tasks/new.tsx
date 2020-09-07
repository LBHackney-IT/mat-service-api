import * as React from 'react';
import { useRouter, NextRouter } from 'next/router';
import Layout from '../../components/layout';
import { Button, Heading, HeadingLevels, Radios } from 'lbh-frontend-react';
import createTask from '../../usecases/ui/createTask';

interface NewProcessProps {
  router: NextRouter;
}

class NewProcessPage extends React.Component {
  constructor(props: NewProcessProps) {
    super(props);
    this.state = { process: undefined };
    this.createTaskHandler = this.createTaskHandler.bind(this);
  }

  createTaskHandler() {
    const tagRef = this.props.router.query.tag_ref;
    const uprn = this.props.router.query.uprn;
    createTask({
      tagRef,
      uprn,
      process: this.state.process,
      subProcess: this.state.subProcess,
    })
      .then((_) => {
        window.location.href = `${process.env.NEXT_PUBLIC_SINGLEVIEW_URL}/tenancies/${tagRef}`;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Layout>
        <Heading level={HeadingLevels.H2}>Create New Process</Heading>
        <Radios
          name="processes"
          items={this.itemTypes(this.isCollapsed())}
          onChange={(value: any): void => {
            this.setState({ process: value, subProcess: undefined });
          }}
          required={true}
        />
        <Button
          className="govuk-button lbh-button"
          onClick={this.createTaskHandler}
          disabled={!this.isReadyToSubmit()}
        >
          Select process
        </Button>
      </Layout>
    );
  }

  isCollapsed(): boolean {
    return this.state.process !== 'thc';
  }

  isReadyToSubmit(): boolean {
    return this.state.process && (this.isCollapsed() || this.state.subProcess);
  }

  itemTypes(collapsed: boolean) {
    const children = collapsed ? null : this.thcSubItemTypes();

    return [
      {
        id: 'homecheck',
        label: {
          children: 'Home Check',
        },
        value: '100000052',
      },
      {
        id: 'itv',
        label: {
          children: 'Introductory Tenancy Visit',
        },
        value: '100000060',
      },
      {
        id: 'thc',
        label: {
          children: 'Tenancy & Household Check',
        },
        value: '100000156',
        childrenWhenChecked: children,
      },
    ];
  }

  thcSubItemTypes() {
    return (
      <>
        <Heading level={HeadingLevels.H4}>
          What is the reason for doing this Tenancy and Household Check?
        </Heading>
        <Radios
          name="thcSubProcesses"
          items={[
            {
              id: 'thcReason1',
              label: {
                children: 'Adverse behaviour about occupants or use of home',
              },
              value: '1',
            },
            {
              id: 'thcReason2',
              label: {
                children: 'Financial irregularity or fraud investigation',
              },
              value: '2',
            },
            {
              id: 'thcReason3',
              label: {
                children: 'Gas safety forced entry',
              },
              value: '3',
            },
            {
              id: 'thcReason4',
              label: {
                children: 'Record of occupancy elsewhere',
              },
              value: '4',
            },
            {
              id: 'thcReason5',
              label: {
                children: 'Rent concerns (large balance / large debt)',
              },
              value: '5',
            },
            {
              id: 'thcReason6',
              label: {
                children: 'Repair concerns (too many / too few)',
              },
              value: '6',
            },
            {
              id: 'thcReason7',
              label: {
                children: 'Right to Buy tenancy verification',
              },
              value: '7',
            },
            {
              id: 'thcReason8',
              label: {
                children: 'Standard occupancy check',
              },
              value: '8',
            },
            {
              id: 'thcReason9',
              label: {
                children: 'Tenancy visit for a transfer application',
              },
              value: '9',
            },
            {
              id: 'thcReason10',
              label: {
                children: 'Vulnerable (elderly / disabled / referral)',
              },
              value: '10',
            },
          ]}
          onChange={(value: any): void => {
            this.setState({ subProcess: value });
          }}
          required={true}
        />
      </>
    );
  }
}

export default (props: any) => {
  const router = useRouter();
  return <NewProcessPage {...props} router={router} />;
};
