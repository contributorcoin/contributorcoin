import { eddsa } from 'elliptic'
import ChainUtil from '../chain-util'
import Blockchain from '../blockchain'
import Transaction from './transaction'

export default class Wallet {
  secret: string          // Wallet secret key
  balance: number         // Wallet balance
  keyPair: eddsa.KeyPair  // Wallet key pair
  publicKey: string       // Wallet public key

  constructor(secret: string) {
    this.secret = secret
    this.balance = 0
    this.keyPair = ChainUtil.genKeyPair(this.secret)
    this.publicKey = this.keyPair.getPublic('hex')
  }

  // Stringify wallet data
  toString(): string {
    return `
    Public Key  : ${this.publicKey.toString()}
    Balance     : ${this.balance}`
  }

  // Wrapper to create transaction from the wallet
  createTransaction(
    type: number,
    to: string,
    amount: number,
    blockchain: Blockchain
  ): Transaction | undefined {
    this.balance = this.getBalance(blockchain)

    // Check wallet balance
    if (amount > this.balance) {
      console.log(
        `✖️ ${amount} exceeds the wallet balance of ${this.balance}`
      )
      return
    }

    const transaction = Transaction.newTransaction(type, this, to, amount)

    if (transaction) {
      return transaction
    }
  }

  // Get the wallet balance
  getBalance(blockchain: Blockchain): number {
    return blockchain.getBalance(this.publicKey)
  }
}
