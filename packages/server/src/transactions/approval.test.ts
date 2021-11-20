import ApprovalTransaction from './approval'

describe('Approval transaction', () => {
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
    ...prData
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
