import ContributionTransaction from './contribution'

describe('Contribution transaction', () => {
  const prData: PrData = {
    provider: 'github',
    owner: 'contributorcoin',
    repo: 'contributorcoin',
    pr: 2,
    signature: 'signature1234567890',
  }

  const data = {
    to: 'morganmspencer',
    amount: 10,
    ...prData,
  }

  const transaction = new ContributionTransaction(data)

  it('should create a contribution transaction with data', () => {
    expect(transaction).toBeInstanceOf(ContributionTransaction)
    expect(transaction).toMatchObject(data)
  })

  it('should have a type of contribution', () => {
    expect(transaction.type).toBe('contribution')
  })

  it('should have an id and timestamp', () => {
    expect(typeof transaction.id).toBe('string')
    expect(typeof transaction.timestamp).toBe('number')
  })
})
