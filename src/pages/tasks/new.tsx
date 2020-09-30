import * as React from 'react';
import { useRouter, NextRouter } from 'next/router';
import Layout from '../../components/layout';
import { Button, Heading, HeadingLevels, Radios } from 'lbh-frontend-react';
import createTask from '../../usecases/ui/createTask';
import { ErrorMessage } from 'lbh-frontend-react';

type Props = {
  router: NextRouter;
};
type State = {
  processType?: string;
  subProcess?: number;
  error?: string | null;
};

class NewProcessPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { processType: undefined, error: null };
    this.createTaskHandler = this.createTaskHandler.bind(this);
  }

  createTaskHandler() {
    if (!this.state.processType) return;
    const tagRef = this.props.router.query.tag_ref as string;

    createTask({
      tagRef,
      processType: this.state.processType,
      subProcess: this.state.subProcess,
    })
      .then((task) => {
        if (task && task.id) {
          window.location.href = `/tasks/${task.id}`;
        } else {
          this.setState({ error: 'createError' });
        }
      })
      .catch(() => this.setState({ error: 'createError' }));
  }

  render() {
    return (
      <Layout>
        <Heading level={HeadingLevels.H2}>Create New Process</Heading>
        <Radios
          name="processes"
          items={this.itemTypes(this.isCollapsed())}
          onChange={(value: string): void => {
            this.setState({ processType: value, subProcess: undefined });
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
        {this.state.error === 'createError' && (
          <ErrorMessage className="sendToManagerError">
            Error creating action
          </ErrorMessage>
        )}
      </Layout>
    );
  }

  isCollapsed(): boolean {
    return this.state.processType !== 'thc';
  }

  isReadyToSubmit(): boolean {
    return (this.state.processType &&
      (this.isCollapsed() || this.state.subProcess)) as boolean;
  }

  itemTypes(collapsed: boolean) {
    const children = collapsed ? null : this.thcSubItemTypes();

    return [
      {
        id: 'homecheck',
        label: {
          children: 'Home Check',
        },
        value: 'homecheck',
      },
      {
        id: 'itv',
        label: {
          children: 'Introductory Tenancy Visit',
        },
        value: 'itv',
      },
      {
        id: 'thc',
        label: {
          children: 'Tenancy & Household Check',
        },
        value: 'thc',
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
          onChange={(value: string): void => {
            this.setState({ subProcess: parseInt(value) });
          }}
          required={true}
        />
      </>
    );
  }
}

export default (props: Props): React.ReactElement => {
  const router = useRouter();
  return <NewProcessPage {...props} router={router} />;
};
