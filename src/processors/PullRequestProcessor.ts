import Transaction from '../transactions/transaction'
import Github from './providers/github'
import logger from '../utils/logger'

export default class PullRequestProcessor {
  url: string

  constructor(url: string) {
    this.url = url
  }

  static async getTransactions(
    url: string
  ): Promise<(ContributionTransaction | ApprovalTransaction)[]> {
    const github = url.match(
      /https?:\/\/github.com\/(([-a-z0-9])*\/){2}commit\/([a-z0-9])*$/gm
    )

    if (github) {
      return await Github.verifyAndRetrieve(url)
    } else {
      return []
    }
  }

  static async createTransactions(
    url: string
  ): Promise<(ContributionTransaction | ApprovalTransaction)[]> {
    const transactions = await this.getTransactions(url)

    // Return if no verified data
    if (transactions.length === 0) {
      const errorMessage = 'Contribution data cannot be verified'
      logger('error', errorMessage)
      throw Error(errorMessage)
    }

    return transactions
  }
}
