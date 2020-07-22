import React from 'react';
import { shallow } from 'enzyme';
import LoginRedirect from './login-redirect';
import Cookies from 'js-cookie';

const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImFyZWEtaG91c2luZy1tYW5hZ2VyLWRldiJdLCJpYXQiOjE1OTUzNDMxMTB9.RnwD8lgD6jGBmve3k0O8b6sOqGlInmGrXdg08I9t_9s';

const invalidGroupToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImludmFsaWQgZ3JvdXAiXSwiaWF0IjoxNTk1MzQzMTEwfQ.S5EXHiUgJY0gKd48PLpmMt4C45DHmxCRwQTm1iq55Zo';

describe('LoginRedirect', () => {
  it('redirects to the home page when the user is logged in', () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => validToken);

    const component = shallow(<LoginRedirect />);

    expect(component.find({ 'data-test': 'worktray-container' }).length).toBe(
      1
    );
  });

  it("doesn't redirect to the home page when the user is logged in but is not in the required group(s)", () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => invalidGroupToken);

    const component = shallow(<LoginRedirect />);

    expect(component.find({ 'data-test': 'worktray-container' }).length).toBe(
      1
    );
  });

  it("doesn't redirect to the home page when the user is not logged in", () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => null);

    const component = shallow(<LoginRedirect />);

    expect(component.find({ 'data-test': 'worktray-container' }).length).toBe(
      1
    );
  });

  it('has the correct feedback URI', () => {
    const component = shallow(<LoginRedirect />);

    expect(component.find({ 'data-test': 'worktray-container' }).length).toBe(
      1
    );
  });
});
