import fetch from 'node-fetch'
import GitProvider from './provider'
import { BadRequestError } from '../utils/error'
import logger from '../utils/logger'

export default class Github extends GitProvider {
  constructor(url: string) {
    super(url)
  }

  // GitHub verification
  static async verifyAndRetrieve(
    url: string
  ): Promise<(ContributionTransaction | ApprovalTransaction)[]> {
    const splitSlug = url.split('github.com/')[1].split('/')
    const owner = splitSlug[0]
    const repo = splitSlug[1]
    const commit = splitSlug[3]

    if (super.checkBannedOwners('github', owner)) {
      throw new BadRequestError(
        'This repo owner is on the Contributorcoin banned list'
      )
    }

    // Get PR and repo data
    const pullsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${commit}/pulls`
    )

    // Convert data to JSON
    const pullsData = await pullsResponse.json()

    // Check for error response
    if (pullsData?.message) {
      throw new BadRequestError(pullsData.message)
    }

    // Check that pulls exist
    if (pullsData.length === 0) {
      throw new BadRequestError('No pull requests associated with this commit')
    }

    const pr = pullsData[0]

    // Repo info
    const repoData = pr.base.repo
    const defaultBranch = repoData.default_branch
    const stars = repoData.stargazers_count

    // Check that repo is public
    if ( repoData?.visibility !== 'public') {
      throw new BadRequestError('Repository must be a public repo')
    }

    if (
      pr.state !== 'closed' ||
      pr.merged_at !== pr.closed_at ||
      pr.base.ref !== defaultBranch
    ) {
      throw new BadRequestError(
        `Pull request is not merged into ${defaultBranch} branch`
      )
    }

    if (pr.merge_commit_sha !== commit) {
      throw new BadRequestError(
        'Commit is not the merge commit for the pull request'
      )
    }

    // Repo star requirement
    if (!super.checkApprovedRepos('github', owner, repo) && stars < 100) {
      throw new BadRequestError('Must have at least 100 stars')
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

    const authors: string[] = []
    const approvers: string[] = []

    const prData: PrData = {
      provider: 'github',
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