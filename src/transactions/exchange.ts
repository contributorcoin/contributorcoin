import Transaction from './transaction'
import Wallet from '../wallet'
import ChainUtil from '../utils/chain-util'
import logger from '../utils/logger'

export default class ExchangeTransaction extends Transaction {
  from: string  // Sender account

  constructor({
    type = TransactionOptions.exchange,
    from,
    to,
    amount,
    signature
  }: ExchangeTypes) {
    super({
      type,
      to,
      amount,
      signature
    })
    this.from = from
  }

  // Stringify transaction data
  toString(): string {
    return super.toString() + `
    From      : ${this.from}`
  }

  // Validate the transaction
  static validate(
    senderWallet: Wallet,
    amount: number,
  ): boolean {
    if (!super.validate()) return false

    if (!senderWallet) {
      logger('error', 'Invalid: no sender provided')
      return false
    } else if (amount > senderWallet.balance) {
      logger('error', `Invalid: ${amount} exceeds the balance`)
      return false
    }

    return true
  }

  // Create the transaction
  static create(
    senderWallet: Wallet,
    from: string,
    to: string,
    amount: number,
  ): ExchangeTransaction | undefined {
    if (!this.validate(senderWallet, amount)) return undefined

    const signature = super.signTransaction(to, amount, senderWallet)

    return new this({from, to, amount, signature})
  }

  // Verify
  static verify(transaction: ExchangeTransaction): boolean {
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
