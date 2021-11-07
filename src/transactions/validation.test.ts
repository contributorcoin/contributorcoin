import ValidationTransaction from './validation'

describe('Validation transaction', () => {
  const data = {
    to: 'morganmspencer',
    amount: 10,
    signature: 'signature1234567890',
    hash: 'hash1234567890',
  }

  const transaction = new ValidationTransaction(data)

  it('should create a validation transaction with data', () => {
    expect(transaction).toBeInstanceOf(ValidationTransaction)
    expect(transaction).toMatchObject(data)
  })

  it('should have a type of validation', () => {
    expect(transaction.type).toBe('validation')
  })

  it('should have an id and timestamp', () => {
    expect(typeof transaction.id).toBe('string')
    expect(typeof transaction.timestamp).toBe('number')
  })
})
