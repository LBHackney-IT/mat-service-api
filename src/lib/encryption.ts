import Rijndael from 'rijndael-js';
import pkcs7 from 'pkcs7-padding';

const iv = Buffer.from([
  53,
  56,
  76,
  75,
  74,
  51,
  52,
  50,
  51,
  52,
  100,
  106,
  102,
  107,
  108,
  49,
]);

export const encrypt = (data: string, key: string): string => {
  const bKey = Buffer.from(key, 'base64');
  const cipher = new Rijndael(bKey, 'cbc');
  const padded = pkcs7.pad(data, 16);
  return Buffer.from(cipher.encrypt(padded, '128', iv)).toString('base64');
};

export const decrypt = (base64Data: string, key: string): string => {
  const bData = Buffer.from(base64Data, 'base64');
  const bKey = Buffer.from(key, 'base64');
  const cipher = new Rijndael(bKey, 'cbc');
  const padded = Buffer.from(cipher.decrypt(bData, '128', iv)).toString();
  return pkcs7.unpad(padded);
};
