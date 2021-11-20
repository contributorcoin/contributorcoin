import Provider from './provider'

describe('Provider', () => {
  describe('Check approved repos', () => {
    it('should return false for non-approved repo', () => {
      const repo = Provider.checkApprovedRepos(
        'github',
        'contributorcoin',
        '.github'
      )

      expect(repo).toBeFalsy()
    })

    it('should return true for approved repo', () => {
      const repo = Provider.checkApprovedRepos(
        'github',
        'contributorcoin',
        'contributorcoin'
      )

      expect(repo).toBeTruthy()
    })
  })

  describe('Check banned owners', () => {
    it('should return true for banned owner', () => {
      const owner = Provider.checkBannedOwners(
        'github',
        'usernameOrOrg'
      )

      expect(owner).toBeTruthy()
    })

    it('should return false for non-banned owner', () => {
      const owner = Provider.checkBannedOwners(
        'github',
        'contributorcoin'
      )

      expect(owner).toBeFalsy()
    })
  })
})
