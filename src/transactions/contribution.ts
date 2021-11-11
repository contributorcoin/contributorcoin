import Transaction from './transaction'
import config from '../config'

export default class ContributionTransaction extends Transaction {
  provider: GitProviders
  owner: string
  repo: string
  pr: number

  constructor({
    type = 'contribution',
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

    this.init()
  }

  // Stringify transaction data
  toString(): string {
    return super.toString() + `
    Provider      : ${this.provider}
    Owner         : ${this.owner}
    Repo          : ${this.repo}
    PR            : ${this.pr}`
  }

  init(): ContributionTransaction | undefined {
    // Validate transaction
    if(!ContributionTransaction.validate(this.amount)) return

    return this
  }

  // Validate the transaction
  static validate(amount: number): boolean {
    if (!super.validate()) return false

    const contributionConfig = config.rewards.contribution
    const maxReward =
      contributionConfig.total * contributionConfig.authorsPercent

    if (amount > maxReward) {
      throw new Error('Invalid: amount is greater than maximum author reward')
    }

    return true
  }
}
