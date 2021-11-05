import Transaction from './transaction'
import logger from '../utils/logger'
import config from '../config'

export default class ContributionTransaction extends Transaction {
  provider: GitProviders
  owner: string
  repo: string
  pr: number

  constructor({
    type = TransactionOptions.contribution,
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
      signature
    })
    this.provider = provider
    this.owner = owner
    this.repo = repo
    this.pr = pr
  }

  // Stringify transaction data
  toString(): string {
    return super.toString() + `
    Provider      : ${this.provider}
    Owner         : ${this.owner}
    Repo          : ${this.repo}
    PR            : ${this.pr}`
  }

  // Validate the transaction
  static validate(amount: number): boolean {
    if (!super.validate()) return false

    if (amount > config.rewards.contribution.total) {
      logger('error', 'Invalid: amount is greater than reward total')
      return false
    }

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
  ): ContributionTransaction | undefined {
    if (!this.validate(amount)) return undefined

    return new this({to, amount, signature, provider, owner, repo, pr})
  }
}
