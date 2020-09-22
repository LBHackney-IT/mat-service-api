import { encrypt, decrypt } from './encryption';
const key = 'q2zacxLVm4wnpe0YcLwmQA==';
const decrypted = 'hello world';
const encrypted = 'qQe0ma3zYlNPdTUHOv3QvA==';

describe('encryption', () => {
  it('should encrypt and base 64 encode data', () => {
    const result = encrypt('hello world', key);
    expect(result).toMatch(encrypted);
  });
});
describe('decryption', () => {
  it('should decrypt base 64 encoded data', () => {
    const result = decrypt(encrypted, key);
    expect(result).toMatch(decrypted);
  });
});
