import { eddsa as EDDSA } from 'elliptic'
import {v4 as uuidv4} from 'uuid'

const eddsa = new EDDSA('ed25519')

export default class ChainUtil {
  static genKeyPair(secret: string): EDDSA.KeyPair {
    return eddsa.keyFromSecret(secret)
  }

  static id(): string {
    return uuidv4()
  }
}
