import Transaction from './transaction'
import { TransactionOptions } from '../utils/enums'
import logger from '../utils/logger'
import config from '../config'

export default class ValidationTransaction extends Transaction {
  hash: string  // Hash of validated block

  constructor({
    type = TransactionOptions.validation,
    to,
    amount,
    signature,
    hash
  }: ValidationTypes) {
    super({
      type,
      to,
      amount,
      signature
    })
    this.hash = hash
  }

  // Stringify transaction data
  toString(): string {
    return super.toString() + `
    Hash      : ${this.hash}`
  }

  init(): ValidationTransaction | undefined {
    // Validate transaction
    if(!ValidationTransaction.validate(this.amount)) return

    return this
  }

  // Validate the transaction
  static validate(amount: number): boolean {
    if (!super.validate()) return false

    const maxReward = config.rewards.validation.total

    if (amount > maxReward) {
      logger(
        'error',
        'Invalid: amount is greater than maximum validation reward'
      )
      return false
    }

    return true
  }
}
