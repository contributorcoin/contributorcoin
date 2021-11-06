import ContributionTransaction from '../../transactions/contribution'
import { GitProviders } from '../../utils/enums'

describe('Contribution transaction', () => {
  const data = {
    to: 'morganmspencer',
    amount: 10,
    signature: 'signature1234567890',
    provider: GitProviders.github,
    owner: 'contributorcoin',
    repo: 'contributorcoin',
    pr: 2
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
