import ChainUtil from '../utils/chain-util'
import Wallet from '../wallet'
import { TransactionOptions } from '../utils/enums'

export default abstract class Transaction {
  id: string                // UUID
  timestamp: number         // Time (now)
  type: TransactionOptions  // Type of transaction
  to: string | number       // Sender address
  amount: number            // Amount sent
  signature: string         // Verification signature

  constructor({
    type = TransactionOptions.exchange,
    to,
    amount,
    signature
  }: TransactionTypes) {
    this.id = ChainUtil.id()
    this.timestamp = Date.now()
    this.type = type
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
    Signature : ${this.signature}
    To        : ${this.to}
    Amount    : ${this.amount}`
  }

  // Validate the transaction
  static validate(...any: any): boolean {
    return true
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
}
