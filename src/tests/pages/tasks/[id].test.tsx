import 'jsdom-global/register';
import React from 'react';
import TaskPage, { getServerSideProps } from '../../../pages/tasks/[id]'
import MockTask from '../../helpers/generateTask'
import { mount } from "enzyme";
require('dotenv').config();

describe('Task Page', () => {
  it('allows us to set props', () => {
    const task = MockTask();

    const component = mount(<TaskPage task={task} />);

    expect(component.props().task).toEqual(task);
  });
});
