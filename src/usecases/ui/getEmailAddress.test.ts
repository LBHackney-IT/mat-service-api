import Cookies from 'js-cookie';
import getEmailAddress from './getEmailAddress';

const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImFyZWEtaG91c2luZy1tYW5hZ2VyLWRldiJdLCJpYXQiOjE1OTUzNDMxMTB9.RnwD8lgD6jGBmve3k0O8b6sOqGlInmGrXdg08I9t_9s';

const noEmailToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJpc3MiOiJIYWNrbmV5IiwibmFtZSI6IlRlc3QgVXNlciIsImdyb3VwcyI6WyJhcmVhLWhvdXNpbmctbWFuYWdlci1kZXYiXSwiaWF0IjoxNTk1MzQzMTEwfQ.Dc5pz050ER9WVgHsudww5neby2JwSJnkk9KtTAivt7M';

describe("get logged in user's email from JWT in cookie", () => {
  it(`returns empty string if email if missing`, async () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => noEmailToken);

    expect(getEmailAddress()).toBe(undefined);
  });

  it(`returns empty string if token is missing`, async () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => null);

    expect(getEmailAddress()).toBe(undefined);
  });

  it(`accepts a valid token`, async () => {
    Cookies.get = jest.fn().mockImplementationOnce(() => validToken);

    expect(getEmailAddress()).toBe('test.user@hackney.gov.uk');
  });
});
