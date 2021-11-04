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

    // Get repo data
    const repoResponse = await fetch(
      // eslint-disable-next-line max-len
      `https://api.github.com/repos/${ownerString}/${repoString}`
    )

    // Convert data to JSON
    const repoData = await repoResponse.json()

    if (repoData?.message === 'Not Found') {
      console.log('✖️ Repository not found, must be a public repo')
      return
    }

    // Repo info
    const defaultBranch = repoData.default_branch
    const stars = repoData.stargazers_count

    // Repo requirements
    // if (stars < 100) {
    //   console.log('✖️ Must have at least 100 stars')
    //   return
    // }

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

    console.log(payload)

    const commitAuthor = commitData.author.login

    if (verified) {
      // Add commit author
      contributors.push(commitAuthor)

      if (payload.match(/Co-authored-by: (.*)<(.*)>/gm)) {
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

    return contributionData
  }
}
