import ContributionTransaction from '../../transactions/contribution'
import ApprovalTransaction from '../../transactions/contribution'
import config from '../../config'

export default abstract class GitProvider {
  url: string

  constructor(url: string) {
    this.url = url
  }

  static createTransactions(
    authors: (string | number)[],
    approvers: (string | number)[],
    prData: PrData,
    verified: boolean,
  ): (ContributionTransaction | ApprovalTransaction)[] {
    if (
      !verified ||
      !prData.signature ||
      (!authors || authors.length === 0)
      // (!approvers || approvers.length === 0)
    ) return []

    const transactions: (ContributionTransaction | ApprovalTransaction)[] = []

    // Rewards
    const rewardType = config.rewards.contribution
    const authorsReward = rewardType.total * rewardType.authorsPercent
    const approversReward = rewardType.total * rewardType.approversPercent

    for (let i = 0; i < authors.length; i++) {
      const user = authors[i]

      transactions.push(
        new ContributionTransaction({
          to: user,
          amount: authorsReward,
          ...prData
        })
      )
    }

    for (let i = 0; i < approvers.length; i++) {
      const user = approvers[i]

      transactions.push(
        new ApprovalTransaction({
          to: user,
          amount: approversReward,
          ...prData
        })
      )
    }

    return transactions
  }
}
