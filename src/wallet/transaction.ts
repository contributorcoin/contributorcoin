import ChainUtil from '../chain-util'
import Wallet from './'
import logger from '../utils/logger'

export enum TransactionType {
  transaction = 'TRANSACTION',
  validator = 'VALIDATOR',
  committer = 'COMMITTER',
  contributor = 'CONTRIBUTOR',
  stake = 'STAKE'
}

export default class Transaction {
  id: string                // Transaction UUID
  timestamp: number         // Transaction time (now)
  type: TransactionType     // Transaction type
  from: string | null       // Transaction sender
  to: string                // Transaction receiver
  amount: number            // Transaction amount
  signature: string | null  // Transaction signature

  constructor(
    type: TransactionType,
    from: string | null,
    to: string,
    amount: number,
    signature: string | null
  ) {
    this.id = ChainUtil.id()
    this.timestamp = Date.now()
    this.type = type
    this.from = from
    this.to = to
    this.amount = amount
    this.signature = signature
  }

  // Stringify transaction data
  toString(): string {
    return `
    ID        : ${this.id}
    Timestamp : ${this.timestamp}
    Type      : ${this.type}
    From      : ${this.from}
    To        : ${this.to}
    Amount    : ${this.amount}
    Signature : ${this.signature}`
  }

  // Initiate new transaction
  static newTransaction(
    type: TransactionType,
    senderWallet: Wallet | null,
    to: string,
    amount: number
  ): Transaction | undefined {
    // Validity checks
    if ([TransactionType.transaction, TransactionType.stake].includes(type)) {
      if (!senderWallet) {
        logger('error', 'Invalid: no sender provided')
        return
      } else if (amount > senderWallet.balance) {
        logger('error', `Invalid: ${amount} exceeds the balance`)
        return
      }
    }

    return Transaction.generateTransaction(type, senderWallet, to, amount)
  }

  // Create a new transaction
  static generateTransaction(
    type: TransactionType,
    senderWallet: Wallet | null,
    to: string,
    amount: number
  ): Transaction | undefined {
    if (![TransactionType.transaction, TransactionType.stake].includes(type)) {
      return new this(type, null, to, amount, null)
    }

    if (senderWallet) {
      const signature = Transaction.signTransaction(to, amount, senderWallet)
      return new this(type, senderWallet.publicKey, to, amount, signature)
    } else {
      logger('error', 'Invalid: no sender provided')
      return
    }
  }

  // Sign the transaction
  static signTransaction(
    to: string,
    amount: number,
    senderWallet: Wallet
  ): string {
    const output = {
      to: to,
      amount: amount
    }

    return senderWallet.sign(ChainUtil.hash(output.toString()))
  }

  static verifyTransaction(transaction: Transaction): boolean {
    if (transaction.from && transaction.signature) {
      const output = {
        to: transaction?.to,
        amount: transaction.amount
      }

      return ChainUtil.verifySignature(
        transaction.from,
        ChainUtil.hash(output.toString()),
        transaction.signature
      )
    }

    return false
  }
}
