import Exchange from './exchange'
import Wallet from '../wallet'

export default class StakeTransaction extends Exchange {
  constructor({
    type = TransactionOptions.stake,
    from,
    to,
    amount,
    signature
  }: ExchangeTypes) {
    super({
      type,
      from,
      to,
      amount,
      signature
    })
  }

  // Stringify transaction data
  toString(): string {
    return super.toString()
  }

  // Validate the transaction
  static validate(
    senderWallet: Wallet,
    amount: number,
  ): boolean {
    if (!super.validate(senderWallet, amount)) return false

    return true
  }

  // Create the transaction
  static create(
    senderWallet: Wallet,
    from: string,
    to: string,
    amount: number
  ): StakeTransaction | undefined {
    if (!this.validate(senderWallet, amount)) return undefined

    const signature = super.signTransaction(to, amount, senderWallet)

    return new this({from, to, amount, signature})
  }

  static verify(transaction: StakeTransaction): boolean {
    return super.verify(transaction)
  }
}
