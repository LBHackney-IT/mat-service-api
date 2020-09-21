import getTokenPayload, { getTokenPayloadFromRequest } from './getTokenPayload';
import generateToken from '../../tests/helpers/generateToken';
const fakeId = 'my-id';
const fakeName = 'Fake Name';
const fakeEmail = 'me@me.com';
const fakeGroups = ['one', 'two'];

const dummyToken = generateToken(
  fakeId,
  fakeName,
  fakeEmail,
  fakeGroups,
  'secret'
);

describe('getTokenPayload', () => {
  it('Should return the payload from a well-formed token', () => {
    const payload = getTokenPayload(dummyToken);
    expect(payload).not.toBe(null);
    expect(payload.sub).toEqual(fakeId);
    expect(payload.name).toEqual(fakeName);
    expect(payload.email).toEqual(fakeEmail);
    expect(payload.groups).toEqual(fakeGroups);
  });

  it('should return null for a badly formed token', () => {
    const payload = getTokenPayload('badToken');
    expect(payload).toBe(null);
  });
});

describe('getTokenPayloadFromRequest', () => {
  it('Should return the payload from a well-formed token', () => {
    const dummyRequest = {
      cookies: { hackneyToken: dummyToken },
    };
    const payload = getTokenPayloadFromRequest(dummyRequest);
    expect(payload).not.toBe(null);
    expect(payload.sub).toEqual(fakeId);
    expect(payload.name).toEqual(fakeName);
    expect(payload.email).toEqual(fakeEmail);
    expect(payload.groups).toEqual(fakeGroups);
  });

  it('should return null for a badly formed token', () => {
    const dummyRequest = {
      cookies: { hackneyToken: `badToken` },
    };
    const payload = getTokenPayloadFromRequest(dummyRequest);
    expect(payload).toBe(null);
  });

  it("should return null if the cookie doesn't exist", () => {
    const dummyRequest = {
      cookies: {},
    };
    const payload = getTokenPayloadFromRequest(dummyRequest);
    expect(payload).toBe(null);
  });
});
