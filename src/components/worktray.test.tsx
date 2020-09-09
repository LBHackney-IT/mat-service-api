import React from 'react';
import { shallow } from 'enzyme';
import Worktray, {
  sampleWorkTrayColumns,
  sampleWorkTrayRows,
} from './worktray';

describe('Worktray', () => {
  it('renders the worktray container', () => {
    const component = shallow(
      <Worktray columns={sampleWorkTrayColumns} rows={sampleWorkTrayRows} />
    );

    expect(component.find({ 'data-test': 'worktray-container' }).length).toBe(
      1
    );
  });
});
