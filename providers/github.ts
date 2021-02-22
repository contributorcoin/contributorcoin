import fetch from 'node-fetch'
import { CommitData } from '../blockchain/contribution'

export default class Github {
  url: string

  constructor(url: string) {
    this.url = url
  }

  // GitHub verification
  static async verify(url: string): Promise<CommitData[] | undefined> {
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

    // Convert data to JSON
    const repoData = await repoResponse.json()

    // Repo info
    const privateRepo = repoData.private
    const defaultBranch = repoData.default_branch
    const stars = repoData.stargazers_count

    // Add contributors if conditions met
    if (!privateRepo && (stars > 100)) {
      // Get commit data
      const commitResponse = await fetch(
        // eslint-disable-next-line max-len
        `https://api.github.com/repos/${ownerString}/${repoString}/commits/${commitString}`
      )

      const commitData = await commitResponse.json()

      // Commit info
      const verified = commitData.commit.verification.verified
      const signature = commitData.commit.verification.signature
      const payload = commitData.commit.verification.payload.toString()

      const commitAuthor = commitData.author.login

      if (verified) {
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


        contributors.forEach(contributor => {
          contributionData.push(
            {
              contributor: contributor,
              signature: signature
            }
          )
        })
      }
    }

    return contributionData
  }
}
