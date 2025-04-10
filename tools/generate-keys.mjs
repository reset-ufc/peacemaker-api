import { randomBytes } from 'node:crypto';

export const generateCryptoKeys = () => {
  const key = randomBytes(32).toString('hex'); // 256 bits (32 bytes)
  const iv = randomBytes(16).toString('hex'); // 128 bits (16 bytes)

  const jwtSecret = randomBytes(64).toString('hex'); // 512 bits (64 bytes)

  return { jwtSecret, key, iv };
};

const { jwtSecret, key, iv } = generateCryptoKeys();

console.log('AUTH_JWT_SECRET=', jwtSecret);
console.log('ENCRYPTION_KEY=', key);
console.log('ENCRYPTION_IV=', iv);
