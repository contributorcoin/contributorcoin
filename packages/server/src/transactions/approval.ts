import Contribution from './contribution'
import { BadRequestError } from '../utils/error'
import config from '../config'

export default class ApprovalTransaction extends Contribution {
  constructor({
    type = 'approval',
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

    this.init()
  }

  // Stringify transaction data
  toString(): string {
    return super.toString()
  }

  init(): ApprovalTransaction | undefined {
    // Validate transaction
    if(!ApprovalTransaction.validate(this.amount)) return

    return this
  }

  // Validate the transaction
  static validate(amount: number): boolean {
    if (!super.validate(amount)) return false

    const contributionConfig = config.rewards.contribution
    const maxReward =
      contributionConfig.total * contributionConfig.approversPercent

    if (amount > maxReward) {
      throw new BadRequestError(
        'Invalid: amount is greater than maximum approver reward'
      )
    }

    return true
  }
}
