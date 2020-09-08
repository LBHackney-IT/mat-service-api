import Cookies from 'js-cookie';
import getFullName from './getFullName';

const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImFyZWEtaG91c2luZy1tYW5hZ2VyLWRldiJdLCJpYXQiOjE1OTUzNDMxMTB9.RnwD8lgD6jGBmve3k0O8b6sOqGlInmGrXdg08I9t_9s';

const noNameToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJncm91cHMiOlsiYXJlYS1ob3VzaW5nLW1hbmFnZXItZGV2Il0sImlhdCI6MTU5NTM0MzExMH0.7ZRJQHHMCYxJCzJGv2dprWYHXJzJ0KRDW1m1MRru1Kw';

describe("get logged in user's full name from JWT in cookie", () => {
  it(`returns empty string if name if missing`, async () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => noNameToken);

    expect(getFullName()).toBe(undefined);
  });

  it(`returns empty string if token is missing`, async () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => null);

    expect(getFullName()).toBe(undefined);
  });

  it(`accepts a valid token`, async () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => validToken);

    expect(getFullName()).toBe('Test User');
  });
});
