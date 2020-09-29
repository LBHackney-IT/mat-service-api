import React from 'react';
import { WorkTray } from 'lbh-frontend-react';

export interface Props {
  columns: Column[];
  rows: Row[];
}

interface Column {
  name: string;
  key: string;
  sortType: string;
  dueDateWarning?: boolean;
}

export interface Row {
  cells: Cell[];
  cautionaryContactKey?: string;
  workItemLink: string;
  workItemId: string;
  workItemStatus: Status;
}

interface Cell {
  key: string;
  value: string | Date;
}

enum Status {
  inProgress,
  complete,
}

const Worktray = (props: Props): React.ReactElement => {
  return (
    <div data-test="worktray-container">
      <WorkTray
        columns={props.columns}
        rows={props.rows}
        cancelWorkItem={() => true}
        reassignWorkItem={() => true}
        searchWorkItems={() => {
          /*NOOP*/
        }}
      />
    </div>
  );
};

export const workTrayColumns = [
  {
    name: 'Created',
    key: 'created',
    sortType: 'datetime',
  },
  {
    name: 'Process / Action',
    key: 'processAction',
    sortType: 'basic',
  },
  {
    name: 'Name',
    key: 'name',
    sortType: 'basic',
  },
  {
    name: 'Address',
    key: 'address',
    sortType: 'basic',
  },
];

export default Worktray;
