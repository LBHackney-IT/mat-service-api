import 'jsdom-global/register';
import React from 'react';
import TaskPage, { getServerSideProps } from '../../../pages/tasks/[id]'
import { mount } from "enzyme";
require('dotenv').config();

describe('Task Page', () => {
  it("has id in props", async () => {

    let res = {
      status: jest.fn()
    };

    const props = await getServerSideProps({ req: {}, res: {} });

    console.log(props);
  });
});
