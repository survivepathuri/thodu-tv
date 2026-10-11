import { getRandomBytes } from 'expo-crypto';

/** Cryptographically secure random bytes (Android SecureRandom via expo-crypto). */
export function randomBytes(n: number): Uint8Array {
  return getRandomBytes(n);
}
