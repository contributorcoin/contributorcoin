import Transaction, { TransactionType } from '../wallet/transaction'
import Github from '../providers/github'
import { VALIDATOR_REWARD } from '../config'

export interface CommitData {
  contributor: string
  signature: string
}

export default class Contribution {
  url: string

  constructor(url: string) {
    this.url = url
  }

  // Create contribution transaction(s)
  static async createContributions(
    url: string
  ): Promise<Transaction[] | undefined> {
    // Set empty transactions array
    const transactions: Transaction[] = []

    // Verify commit
    const verifiedData = await this.verifyAndRetrieve(url)

    // Return if no verified data
    if (!verifiedData || !verifiedData.length) {
      return
    }

    // Create contributor reward
    verifiedData.forEach((commitData: CommitData) => {
      const contributorTransaction = Transaction.newTransaction(
        TransactionType.contributorReward,
        null,
        commitData.contributor,
        VALIDATOR_REWARD / verifiedData.length
      )

      if (contributorTransaction) {
        transactions.push(contributorTransaction)
      }
    })

    return transactions
  }

  static async verifyAndRetrieve(
    url: string
  ): Promise<CommitData[] | undefined> {
    let verifiedData

    // GitHub
    if (url.match(
      /https?:\/\/github.com\/(([-a-z0-9])*\/){2}commit\/([a-z0-9])*$/gm
    )) {
      verifiedData = await Github.verify(url)
    }

    return verifiedData
  }
}
