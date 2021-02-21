import psl from 'psl'
import fetch from 'node-fetch'
import Transaction, { TransactionType } from '../wallet/transaction'
import { VALIDATOR_REWARD } from '../config'

interface CommitData {
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

  // eslint-disable-next-line max-len
  static async verifyAndRetrieve(url: string): Promise<CommitData[] | undefined> {
    const hostname = psl.get(this.extractHostname(url))
    let verifiedData

    if (hostname === 'github.com') {
      verifiedData = await this.github(url)
    }

    return verifiedData
  }

  // GitHub verification
  static async github(url: string): Promise<CommitData[] | undefined> {
    const splitSlug = url.split('github.com/')[1].split('/')
    const ownerString = splitSlug[0]
    const repoString = splitSlug[1]
    const commitString = splitSlug[3]
    const contributors: string[] = []
    const contributionData: CommitData[] = []

    // Return if incorrect data
    if (!ownerString || !repoString || !commitString) {
      return
    }

    // Get repo data
    const repoResponse = await fetch(
      // eslint-disable-next-line max-len
      `https://api.github.com/repos/${ownerString}/${repoString}`
    )

    // Get commit data
    const commitResponse = await fetch(
      // eslint-disable-next-line max-len
      `https://api.github.com/repos/${ownerString}/${repoString}/commits/${commitString}`
    )

    // Convert data to JSON
    const repoData = await repoResponse.json()
    const commitData = await commitResponse.json()

    // Repo info
    const privateRepo = repoData.private
    const defaultBranch = repoData.default_branch
    const stars = repoData.stargazers_count

    // Commit info
    const verified = commitData.commit.verification.verified
    const signature = commitData.commit.verification.signature
    const payload = commitData.commit.verification.payload.toString()

    const commitAuthor = commitData.author.login

    // Add commit author
    contributors.push(commitAuthor)

    // Add co-authors
    for (const coauthor of payload.match(/Co-authored-by: (.*)<(.*)>/gm)) {
      const email = coauthor.split('<')[1].slice(0, -1)

      const userResponse = await fetch(
        // eslint-disable-next-line max-len
        `https://api.github.com/search/users?q=${email}`
      )

      const userData = await userResponse.json()

      if (userData.items && userData.items.length) {
        const username = userData.items[0].login
        if (!contributors.includes(username)) {
          contributors.push(username)
        }
      }
    }

    // Add contributors if conditions met
    if (!privateRepo && verified && (stars > 100)) {
      contributors.forEach(contributor => {
        contributionData.push(
          {
            contributor: contributor,
            signature: signature
          }
        )
      })
    }

    return contributionData
  }

  static extractHostname(url: string) {
    let hostname

    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2]
    }
    else {
      hostname = url.split('/')[0]
    }

    hostname = hostname.split(':')[0]
    hostname = hostname.split('?')[0]

    return hostname
  }
}
