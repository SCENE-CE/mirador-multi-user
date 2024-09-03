import * as crypto from 'crypto';

export function generateAlphanumericSHA1Hash(stringToHash: string): string {
  const hash = crypto.createHash('sha1').update(stringToHash).digest('hex');
  return hash;
}
