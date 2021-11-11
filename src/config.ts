export default {
  transactions: {
    thresholdCount: 5,
    poolTimeCap: 300000
  },
  rewards: {
    contribution: {
      total: 100,
      authorsPercent: .8,
      approversPercent: .2
    },
    validation: {
      total: 10,
    }
  },
  approvedRepos: [
    {
      provider: 'github',
      owner: 'contributorcoin',
      repo: 'contributorcoin',
    }
  ],
  bannedOwners: [
    {
      provider: 'github',
      owner: 'usernameOrOrg'
    }
  ],
}
