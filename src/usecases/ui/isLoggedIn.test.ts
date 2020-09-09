import isLoggedIn from './isLoggedIn';

const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImFyZWEtaG91c2luZy1tYW5hZ2VyLWRldiJdLCJpYXQiOjE1OTUzNDMxMTB9.RnwD8lgD6jGBmve3k0O8b6sOqGlInmGrXdg08I9t_9s';

const invalidGroupToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImludmFsaWQtZ3JvdXAiXSwiaWF0IjoxNTk1MzQzMTEwfQ.wNwUuS5plwuIZ9Wkv2WSYzvbRVwlM0iNsUR3yx4ZVn4';

describe('get JWT from cookie', () => {
  beforeEach(() => {
    process.env.ALLOWED_GROUPS = 'housing-officer-dev,area-housing-manager-dev';
  });

  it(`rejects an invalid token`, async () => {
    expect(isLoggedIn(invalidGroupToken)).toBeFalsy();
  });

  it(`rejects no token`, async () => {
    expect(isLoggedIn(undefined)).toBeFalsy();
  });

  it(`accepts a valid token`, async () => {
    expect(isLoggedIn(validToken)).toBeTruthy();
  });
});
