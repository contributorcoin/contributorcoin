import ChainUtil from '../chain-util'
import Wallet from './'

export enum TransactionType {
  transaction
}

export default class Transaction {
  id: string            // Transaction UUID
  timestamp: number     // Transaction time (now)
  type: TransactionType // Transaction type
  from: string          // Transaction sender
  to: string            // Transaction receiver
  amount: number        // Transaction amount

  constructor(type: TransactionType, from: string, to: string, amount: number) {
    this.id = ChainUtil.id()
    this.timestamp = Date.now()
    this.type = type
    this.from = from
    this.to = to
    this.amount = amount
  }

  // Stringify transaction data
  toString(): string {
    return `
    ID        : ${this.id}
    Timestamp : ${this.timestamp}
    Type      : ${this.type}
    From      : ${this.from}
    To        : ${this.to}
    Amount    : ${this.amount}`
  }

  // Initiate new transaction
  static newTransaction(
    type: number,
    senderWallet: Wallet,
    to: string,
    amount: number
  ): Transaction | undefined {
    // Validity checks
    if (!senderWallet) {
      console.log('✖️ Invalid: no sender provided')
      return
    } else if (amount > senderWallet.balance) {
      console.log(
        `✖️ Invalid: ${amount} exceeds the balance`
      )
      return
    }

    return Transaction.generateTransaction(type, senderWallet, to, amount)
  }

  static generateTransaction(
    type: number,
    senderWallet: Wallet,
    to: string,
    amount: number
  ): Transaction | undefined {
    if (senderWallet) {
      return new this(type, senderWallet.publicKey, to, amount)
    } else {
      console.log('✖️ Invalid: no sender provided')
      return
    }
  }
}
