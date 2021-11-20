import Github from '../providers/github'
import { BadRequestError } from '../utils/error'

export default class PullRequestProcessor {
  url: string

  constructor(url: string) {
    this.url = url
  }

  static async getTransactions(
    url: string
  ): Promise<(ContributionTransaction | ApprovalTransaction)[]> {
    const github = url.match(
      /https:\/\/github.com\/(([-a-z0-9])*\/){2}commit\/([a-z0-9]{10,})*$/gm
    )

    if (github) {
      return await Github.verifyAndRetrieve(url)
    } else {
      throw new BadRequestError('Invalid URL provided')
    }
  }

  static async createTransactions(
    url: string
  ): Promise<(ContributionTransaction | ApprovalTransaction)[]> {
    const transactions = await this.getTransactions(url)

    // Return if no verified data
    if (transactions.length === 0) {
      throw  new BadRequestError('Contribution data cannot be verified')
    }

    return transactions
  }
}
