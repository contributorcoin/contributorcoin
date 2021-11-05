import Transaction from './transaction'

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

  // Validate the transaction
  static validate(): boolean {
    if (!super.validate()) return false

    return true
  }

  // Create the transaction
  static create(
    to: string,
    amount: number,
    signature: string,
    hash: string
  ): ValidationTransaction | undefined {
    if (!this.validate()) return undefined

    return new this({to, amount, signature, hash})
  }
}
