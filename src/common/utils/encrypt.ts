import { createCipheriv, createDecipheriv } from 'node:crypto';

export async function encryptToken(content: string) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex');
  const iv = Buffer.from(process.env.ENCRYPTION_IV as string, 'hex');

  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

export async function decryptToken(content: string) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex');
  const iv = Buffer.from(process.env.ENCRYPTION_IV as string, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
