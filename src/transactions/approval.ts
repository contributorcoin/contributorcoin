import Contribution from './contribution'

export default class ApprovalTransaction extends Contribution {
  constructor({
    type = TransactionOptions.approval,
    to,
    amount,
    signature,
    provider,
    owner,
    repo,
    pr
  }: ContributionTypes) {
    super({
      type,
      to,
      amount,
      signature,
      provider,
      owner,
      repo,
      pr
    })
  }

  // Stringify transaction data
  toString(): string {
    return super.toString()
  }

  // Validate the transaction
  static validate(amount: number): boolean {
    if (!super.validate(amount)) return false

    return true
  }

  // Create the transaction
  static create(
    to: string,
    amount: number,
    signature: string,
    provider: GitProviders,
    owner: string,
    repo: string,
    pr: number
  ): ApprovalTransaction | undefined {
    if (!this.validate(amount)) return undefined

    return new this({to, amount, signature, provider, owner, repo, pr})
  }
}
