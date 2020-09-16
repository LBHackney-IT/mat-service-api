import getAuthToken from './getAuthToken';

describe('getAuthToken', () => {
  it('should return the hackneyToken cookie', () => {
    const cookie = 'hackneyToken=abc123;';
    const result = getAuthToken({ cookie });
    expect(result).toEqual('abc123');
  });
  it('should return undefined if hackneyToken cookie is not set', () => {
    const cookie = 'notHackneyToken=abc123;';
    const result = getAuthToken({ cookie });
    expect(result).toBeUndefined();
  });
});
