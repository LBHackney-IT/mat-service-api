import * as React from 'react';
import { shallow } from 'enzyme';
import Hello from './hello';

describe('Hello', () => {
	it('Renders Nigel', () => {
		const hello = shallow(<Hello name="Nigel" greeting="Hello"></Hello>);
		expect(hello.html()).toBe("<div class=\"hello\">Hello Nigel, you have 0 tenancies!</div>");
		expect(hello.find('.hello').length).toBe(1);
		expect(hello).toMatchSnapshot();
	});

	it('Renders Matt', () => {
		const hello = shallow(<Hello name="Matt" greeting="Hello"></Hello>);
		expect(hello.html()).toBe("<div class=\"hello\">Hello Matt, you have 3 tenancies!</div>");
		expect(hello.find('.hello').length).toBe(1);
		expect(hello).toMatchSnapshot();
	});
});
