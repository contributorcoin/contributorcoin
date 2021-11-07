import StakeTransaction from './stake'

describe('Stake transaction', () => {
  const data = {
    to: 'stake-account',
    from: 'morganmspencer',
    amount: 10,
    signature: 'signature1234567890',
  }

  const transaction = new StakeTransaction(data)

  it('should create a stake transaction with data', () => {
    expect(transaction).toBeInstanceOf(StakeTransaction)
    expect(transaction).toMatchObject(data)
  })

  it('should have a type of stake', () => {
    expect(transaction.type).toBe('stake')
  })

  it('should have an id and timestamp', () => {
    expect(typeof transaction.id).toBe('string')
    expect(typeof transaction.timestamp).toBe('number')
  })
})
