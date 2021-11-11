import Transaction from './transaction'
import ChainUtil from '../utils/chain-util'

export default class ExchangeTransaction extends Transaction {
  from: string  // Sender account

  constructor({
    type = 'exchange',
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
      throw new Error('Invalid: no sender provided')
    } else if (amount > senderWallet.balance) {
      throw new Error(`Invalid: ${amount} exceeds the balance`)
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
