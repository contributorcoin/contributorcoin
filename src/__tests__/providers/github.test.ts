/* eslint-disable max-len */
import PullRequestProcessor from '../../processors/PullRequestProcessor'

const urls = {
  correct: 'https://github.com/contributorcoin/contributorcoin/commit/cb9f81fe84b9be70ce5cd022b907d62a730beb34',
  incorrect: 'https://github.com/contributorcoin/contributorcoin',
  noCommit: 'https://github.com/contributorcoin/contributorcoin/commit/154b285448b41899',
  notPr: 'https://github.com/contributorcoin/contributorcoin/commit/154b285448b4189912379d978d9db3f72df2b5b8',
  starCount: 'https://github.com/contributorcoin/.github/commit/a25a40f0a16d63324f74946deb4e635c11c46912'
}

describe('GitHub provider', () => {
  it('should fail if incorrect url structure', async () => {
    await expect(PullRequestProcessor.createTransactions(
      urls.incorrect
    )).rejects.toThrow(Error)
  })

  it('should fail if commit does not exist', async () => {
    await expect(PullRequestProcessor.createTransactions(
      urls.noCommit
    )).rejects.toThrow(Error)
  })

  it('should fail if commit is not a PR', async () => {
    await expect(PullRequestProcessor.createTransactions(
      urls.notPr
    )).rejects.toThrow(Error)
  })

  it('should fail if star count is below minimum required', async () => {
    await expect(PullRequestProcessor.createTransactions(
      urls.starCount
    )).rejects.toThrow(Error)
  })

  it('should return transactions', async () => {
    const transactions = await PullRequestProcessor.createTransactions(
      urls.correct
    )

    expect(transactions.length).toEqual(1)
  })
})
