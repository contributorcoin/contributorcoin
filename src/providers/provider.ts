import ContributionTransaction from '../transactions/contribution'
import ApprovalTransaction from '../transactions/contribution'
import config from '../config'

const approvedRepos = config.approvedRepos
const bannedOwners = config.bannedOwners

export default abstract class GitProvider {
  url: string

  constructor(url: string) {
    this.url = url
  }

  static createTransactions(
    authors: string[],
    approvers: string[],
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

  static checkApprovedRepos(
    provider: string,
    owner: string,
    repo: string
  ): boolean {
    const findApproved = approvedRepos.filter((e) => {
      if (e.provider === provider && e.owner === owner && e.repo === repo) {
        return true
      }
      return false
    })

    if (findApproved.length > 0) return true

    return false
  }

  static checkBannedOwners(provider: string, owner: string) {
    const findBanned = bannedOwners.filter((e) => {
      if (e.provider === provider && e.owner === owner) {
        return true
      }
      return false
    })

    if (findBanned.length > 0) return true

    return false
  }
}
