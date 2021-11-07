import ApprovalTransaction from './approval'
import { GitProviders } from '../utils/enums'

describe('Approval transaction', () => {
  const data = {
    to: 'morganmspencer',
    amount: 10,
    signature: 'signature1234567890',
    provider: GitProviders.github,
    owner: 'contributorcoin',
    repo: 'contributorcoin',
    pr: 2
  }

  const transaction = new ApprovalTransaction(data)

  it('should create an approval transaction with data', () => {
    expect(transaction).toBeInstanceOf(ApprovalTransaction)
    expect(transaction).toMatchObject(data)
  })

  it('should have a type of approval', () => {
    expect(transaction.type).toBe('approval')
  })

  it('should have an id and timestamp', () => {
    expect(typeof transaction.id).toBe('string')
    expect(typeof transaction.timestamp).toBe('number')
  })
})
