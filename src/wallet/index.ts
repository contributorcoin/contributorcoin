import { eddsa } from 'elliptic'
import ChainUtil from '../utils/chain-util'
import Blockchain from '../blockchain'
import ExchangeTransaction from '../transactions/exchange'
import TransactionPool from './transaction-pool'
import logger from '../utils/logger'

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
    type: TransactionOptions,
    to: string,
    amount: number,
    blockchain: Blockchain,
    transactionPool: TransactionPool
  ): ExchangeTransaction | undefined {
    this.balance = this.getBalance(blockchain)
    const transactionType = type ? type : TransactionOptions.exchange

    // Only allow standard transactions from wallet
    if (
      ![TransactionOptions.exchange, TransactionOptions.stake].includes(
        transactionType
      )
    ) {
      console.log(
        '✖️ Invalid transaction: You cannot create this type of transaction'
      )
      return
    }

    // Check wallet balance
    if (amount > this.balance) {
      console.log(
        `✖️ ${amount} exceeds the wallet balance of ${this.balance}`
      )
      return
    }

    const transaction = new ExchangeTransaction({
      from: this, to, amount
    })

    if (transaction) {
      transactionPool.addTransaction(transaction)
      return transaction
    }
  }

  // Get the wallet balance
  getBalance(blockchain: Blockchain): number {
    return blockchain.getBalance(this.publicKey)
  }

  // Sign the transaction
  sign(dataHash: string): string {
    return this.keyPair.sign(dataHash).toHex()
  }

  // Get wallet public key
  getPublicKey(): string {
    return this.publicKey
  }
}
