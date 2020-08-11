import React from "react";
import { WorkTray } from "lbh-frontend-react"
import moment from "moment";

export interface Props {
  columns: Column[]
  rows: Row[]
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
  workItemStatus: Status
}

interface Cell {
  key: string;
  value: string | Date;
}

enum Status {
  inProgress,
  complete,
}

const Worktray = (props: Props) => {

  return (
    <div data-test="worktray-container">
      <WorkTray
        columns={props.columns}
        rows={props.rows}
        cancelWorkItem={() => (true)}
        reassignWorkItem={() => (true)}
        searchWorkItems={() => {/*NOOP*/}}
      />
    </div>
  )
}

const currentDate = moment(new Date());
const pendingDate = moment(
  moment(currentDate).add(3, "days").format("DD/MM/YYYY"),
  "DD/MM/YYYY"
).toDate();
const overdueDate = moment(
  moment(currentDate).subtract(1, "days").format("DD/MM/YYYY"),
  "DD/MM/YYYY"
).toDate();
const validDate = moment(
  moment(currentDate).add(7, "days").format("DD/MM/YYYY"),
  "DD/MM/YYYY"
).toDate();

export const sampleWorkTrayColumns = [
  {
    name: "Created",
    key: "created",
    sortType: "datetime",
  },
  {
    name: "Process / Action",
    key: "processAction",
    sortType: "basic",
  },
  {
    name: "Name",
    key: "name",
    sortType: "basic",
  },
  {
    name: "Address",
    key: "address",
    sortType: "basic",
  },
  {
    name: "Due / Completion",
    key: "dueCompletion",
    sortType: "datetime",
    dueDateWarning: true,
  },
];

export const sampleWorkTrayRows = [
  {
    cells: [
      {
        key: "created",
        value: moment("09/07/2020", "DD/MM/YYYY").toDate(),
      },
      {
        key: "processAction",
        value: "Pop in to say Hello",
      },
      {
        key: "name",
        value: "Mr John Smith",
      },
      {
        key: "address",
        value: "123 That Road",
      },
      {
        key: "dueCompletion",
        value: overdueDate,
      },
    ],
    workItemLink: "https://hackney.gov.uk",
    workItemId: "123",
    workItemStatus: Status.inProgress,
  },
  {
    cells: [
      {
        key: "created",
        value: moment("16/09/2019", "DD/MM/YYYY").toDate(),
      },
      {
        key: "processAction",
        value: "Housing Check",
      },
      {
        key: "name",
        value: "Mrs Fran Walters",
      },
      {
        key: "address",
        value: "246 The Road",
      },
      {
        key: "dueCompletion",
        value: pendingDate,
      },
    ],
    workItemLink: "https://google.co.uk",
    workItemId: "abc",
    workItemStatus: Status.inProgress,
  },
  {
    cells: [
      {
        key: "created",
        value: moment("16/09/2019", "DD/MM/YYYY").toDate(),
      },
      {
        key: "processAction",
        value: "Going over notes",
      },
      {
        key: "name",
        value: "Mrs Suzanna Foxtrot",
      },
      {
        key: "address",
        value: "Flat 12, Dummy Data Building",
      },
      {
        key: "dueCompletion",
        value: validDate,
      },
    ],
    workItemLink: "https://google.co.uk",
    workItemId: "abc",
    workItemStatus: Status.complete,
  },
  {
    cells: [
      {
        key: "created",
        value: moment("10/07/2020", "DD/MM/YYYY").toDate(),
      },
      {
        key: "processAction",
        value: "ITV",
      },
      {
        key: "name",
        value: "Mrs Jane Fonda",
      },
      {
        key: "address",
        value: "10, The Drive",
      },
      {
        key: "dueCompletion",
        value: moment("20/12/2020", "DD/MM/YYYY").toDate(),
      },
    ],
    workItemLink: "https://hackney.gov.uk",
    workItemId: "123",
    workItemStatus: Status.complete,
  },
  {
    cells: [
      {
        key: "created",
        value: moment("01/07/2020", "DD/MM/YYYY").toDate(),
      },
      {
        key: "processAction",
        value: "T&HC",
      },
      {
        key: "name",
        value: "Ms Amanda Higgins",
      },
      {
        key: "address",
        value: "Flat 6, Devonshire Avenue",
      },
      {
        key: "dueCompletion",
        value: moment("1/09/2020", "DD/MM/YYYY").toDate(),
      },
    ],
    workItemLink: "https://hackney.gov.uk",
    workItemId: "123",
    workItemStatus: Status.inProgress,
  },
  {
    cells: [
      {
        key: "created",
        value: moment("01/07/2020", "DD/MM/YYYY").toDate(),
      },
      {
        key: "processAction",
        value: "ETRA",
      },
      {
        key: "name",
        value: "Sir Walter Raleigh",
      },
      {
        key: "address",
        value: "Bel-air, Throne View Street",
      },
      {
        key: "dueCompletion",
        value: moment("23/11/2020", "DD/MM/YYYY").toDate(),
      },
    ],
    workItemLink: "https://hackney.gov.uk",
    workItemId: "123",
    workItemStatus: Status.inProgress,
  },
  {
    cells: [
      {
        key: "created",
        value: moment("15/07/2020", "DD/MM/YYYY").toDate(),
      },
      {
        key: "processAction",
        value: "ASB",
      },
      {
        key: "name",
        value: "Ms Joanna Treend",
      },
      {
        key: "address",
        value: "Apartment 4, Vassall Estate",
      },
      {
        key: "dueCompletion",
        value: moment("29/08/2020", "DD/MM/YYYY").toDate(),
      },
    ],
    workItemLink: "https://hackney.gov.uk",
    workItemId: "123",
    workItemStatus: Status.complete,
  },
  {
    cells: [
      {
        key: "created",
        value: moment("06/07/2020", "DD/MM/YYYY").toDate(),
      },
      {
        key: "processAction",
        value: "HC",
      },
      {
        key: "name",
        value: "Mr Elton John",
      },
      {
        key: "address",
        value: "45, Windswept Road",
      },
      {
        key: "dueCompletion",
        value: moment("31/07/2020", "DD/MM/YYYY").toDate(),
      },
    ],
    workItemLink: "https://hackney.gov.uk",
    workItemId: "123",
    workItemStatus: Status.complete,
  },
];

export default Worktray;
