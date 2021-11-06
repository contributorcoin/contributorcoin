import fetch from 'node-fetch'
import Transaction from '../../transactions/transaction'
import GitProvider from './provider'
import { GitProviders } from '../../utils/enums'
import logger from '../../utils/logger'

export default class Github extends GitProvider {
  constructor(url: string) {
    super(url)
  }

  // GitHub verification
  static async verifyAndRetrieve(
    url: string
  ): Promise<Transaction[]> {
    const splitSlug = url.split('github.com/')[1].split('/')
    const owner = splitSlug[0]
    const repo = splitSlug[1]
    const ownerRepo = `${owner}/${repo}`
    const commit = splitSlug[3]

    // Get PR and repo data
    const pullsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${commit}/pulls`
    )

    // Convert data to JSON
    const pullsData = await pullsResponse.json()

    // Check for error response
    if (pullsData?.message) {
      throw Error(pullsData.message)
    }

    // Check that pulls exist
    if (pullsData.length === 0) {
      const errorMessage = 'No pull requests associated with this commit'
      logger('error', errorMessage)
      throw Error(errorMessage)
    }

    const pr = pullsData[0]

    // Repo info
    const repoData = pr.base.repo
    const defaultBranch = repoData.default_branch
    const stars = repoData.stargazers_count

    // Check that repo is public
    if ( repoData?.visibility !== 'public') {
      const errorMessage = 'Repository must be a public repo'
      logger('error', errorMessage)
      throw Error(errorMessage)
    }

    if (
      pr.state !== 'closed' ||
      pr.merged_at !== pr.closed_at ||
      pr.base.ref !== defaultBranch
    ) {
      const errorMessage =
        `Pull request is not merged into ${defaultBranch} branch`
      logger('error', errorMessage)
      throw Error(errorMessage)
    }

    if (pr.merge_commit_sha !== commit) {
      const errorMessage = 'Commit is not the merge commit for the pull request'
      logger('error', errorMessage)
      throw Error(errorMessage)
    }

    // Repo star requirement
    // Does not apply to Contributorcoin core
    if (ownerRepo !== 'contributorcoin/contributorcoin' && stars < 100) {
      const errorMessage = 'Must have at least 100 stars'
      logger('error', errorMessage)
      throw Error(errorMessage)
    }

    // Get commit data
    const commitResponse = await fetch(
      `${repoData.url}/commits/${commit}`
    )

    const commitData = await commitResponse.json()

    // Commit info
    const verified: boolean = commitData.commit.verification.verified
    const signature: string = commitData.commit.verification.signature
    const payload = commitData.commit.verification.payload.toString()

    const commitAuthor = commitData.author.id

    const authors: (string | number)[] = []
    const approvers: (string | number)[] = []

    const prData = {
      provider: GitProviders.github,
      owner,
      repo,
      pr: pr.number,
      signature
    }

    if (verified && signature) {

      // Add commit author
      authors.push(commitAuthor)

      if (payload.match(/Co-authored-by: (.*)<(.*)>/gm)) {
        // Add co-authors
        for (const coauthor of payload.match(/Co-authored-by: (.*)<(.*)>/gm)) {
          const email = coauthor.split('<')[1].slice(0, -1)

          const userResponse = await fetch(
            // eslint-disable-next-line max-len
            `https://api.github.com/search/users?q=${email}`
          )

          const userData = await userResponse.json()

          if (userData?.message) {
            logger(
              'error',
              // eslint-disable-next-line max-len
              `Could not get user data for ${email}, no Contributorcoin attributed`
            )
            continue
          }

          if (userData.items && userData.items.length) {
            const id = userData.items[0].id
            if (!authors.includes(id)) {
              authors.push(id)
            }
          }
        }
      }
    }

    return super.createTransactions(
      authors,
      approvers,
      prData,
      verified
    )
  }
}
