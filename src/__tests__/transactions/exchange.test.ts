import ExchangeTransaction from '../../transactions/exchange'

describe('Exchange transaction', () => {
  const data = {
    from: 'github',
    to: 'morganmspencer',
    amount: 10,
    signature: 'signature1234567890',
  }

  const transaction = new ExchangeTransaction(data)

  it('should create an exchange transaction with data', () => {
    expect(transaction).toBeInstanceOf(ExchangeTransaction)
    expect(transaction).toMatchObject(data)
  })

  it('should have a type of exchange', () => {
    expect(transaction.type).toBe('exchange')
  })

  it('should have an id and timestamp', () => {
    expect(typeof transaction.id).toBe('string')
    expect(typeof transaction.timestamp).toBe('number')
  })
})
