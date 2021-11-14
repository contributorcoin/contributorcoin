import { Octokit } from 'octokit'
import { createAppAuth } from '@octokit/auth-app'
import GitProvider from './provider'
import { BadRequestError } from '../utils/error'
import logger from '../utils/logger'

const octokitData: Record<string, unknown> = {}

if (process.env.GITHUB_PRIVATE_KEY) {
  octokitData['authStrategy'] = createAppAuth
  octokitData['auth'] = {
    appId: 1,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
    installationId: 123
  }
} else if (process.env.GITHUB_PAT) {
  octokitData['auth'] = process.env.GITHUB_PAT
}

const octokit = new Octokit(octokitData)

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
    const request = await octokit.request(
      `GET /repos/${owner}/${repo}/commits/${commit}/pulls`
    )

    // Check for error response
    if (request.status !== 200) {
      throw new BadRequestError('Could not get GitHub data')
    }

    // Check that pulls exist
    if (request.data.length === 0) {
      throw new BadRequestError('No pull requests associated with this commit')
    }

    const pr = request.data[0]

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
    const commitRequest = await octokit.request(
      `GET /repos/${owner}/${repo}/commits/${commit}`
    )

    // Commit info
    const verified: boolean = commitRequest.data.commit.verification.verified
    const signature: string = commitRequest.data.commit.verification.signature
    const payload = commitRequest.data.commit.verification.payload.toString()

    const commitAuthor = commitRequest.data.author.id

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

          const userRequest = await octokit.request(
            `GET /search/users?q=${email}`
          )

          if (userRequest.status !== 200) {
            logger(
              'error',
              // eslint-disable-next-line max-len
              `Could not get user data for ${email}, no Contributorcoin attributed`
            )
            continue
          }

          if (userRequest.data.items && userRequest.data.items.length) {
            const id = userRequest.data.items[0].id
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
