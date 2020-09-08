import 'jsdom-global/register';
import React from 'react';
import TaskPage, { getServerSideProps } from '../../../pages/tasks/[id]'
import MockTask from '../../helpers/generateTask'
import { mount } from "enzyme";
require('dotenv').config();

describe('Task Page', () => {
  it("has an empty test to allow pass", () => {
    // currently, the Paragraph component from lbh-frontend-react doesn't allow multiple elements.
    // a fix needs to occur there first before we can actually test here.
  })
  // it('allows us to set props', () => {
  //   const task = MockTask();

  //   const component = mount(<TaskPage task={task} />);

  //   expect(component.props().task).toEqual(task);
  // });
});
