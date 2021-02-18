import { eddsa as EDDSA } from 'elliptic'
import {v4 as uuidv4} from 'uuid'
import SHA256 from 'crypto-js/sha256'

const eddsa = new EDDSA('ed25519')

export default class ChainUtil {
  // Create key pair from secret key
  static genKeyPair(secret: string): EDDSA.KeyPair {
    return eddsa.keyFromSecret(secret)
  }

  // Create a UUID
  static id(): string {
    return uuidv4()
  }

  // Create a hash with data provided
  static hash(data: string): string {
    return SHA256(JSON.stringify(data)).toString()
  }

  // Verify a signature
  static verifySignature(
    publicKey: string,
    dataHash: string,
    signature: string
  ): boolean {
    return eddsa.keyFromPublic(publicKey).verify(dataHash, signature)
  }
}
