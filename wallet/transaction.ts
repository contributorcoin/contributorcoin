import ChainUtil from '../chain-util'
import Wallet from './'

export enum TransactionType {
  transaction,
  committerReward,
  contributorReward
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
    type: number,
    senderWallet: Wallet | null,
    to: string,
    amount: number
  ): Transaction | undefined {
    // Validity checks
    if (type === TransactionType.transaction) {
      if (!senderWallet) {
        console.log('✖️ Invalid: no sender provided')
        return
      } else if (amount > senderWallet.balance) {
        console.log(
          `✖️ Invalid: ${amount} exceeds the balance`
        )
        return
      }
    }

    return Transaction.generateTransaction(type, senderWallet, to, amount)
  }

  // Create a new transaction
  static generateTransaction(
    type: number,
    senderWallet: Wallet | null,
    to: string,
    amount: number
  ): Transaction | undefined {
    if (type !== TransactionType.transaction) {
      return new this(type, null, to, amount, null)
    }

    if (senderWallet) {
      const signature = Transaction.signTransaction(to, amount, senderWallet)
      return new this(type, senderWallet.publicKey, to, amount, signature)
    } else {
      console.log('✖️ Invalid: no sender provided')
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
