import TransactionPool from './transaction-pool'
import Validation from '../transactions/validation'

let transactionPool: TransactionPool

describe('Transaction pool', () => {
  beforeEach(() => {
    transactionPool = new TransactionPool
  })

  const transaction = new Validation({
    to: 'morganmspencer',
    amount: 10,
    signature: 'signature1234567890',
    hash: 'hash1234567890'
  })

  it('should check transaction threshold', () => {
    expect(transactionPool.thresholdReached()).toBeFalsy()

    transactionPool.addTransaction(transaction)
    transactionPool.addTransaction(transaction)
    transactionPool.addTransaction(transaction)
    transactionPool.addTransaction(transaction)
    transactionPool.addTransaction(transaction)

    expect(transactionPool.thresholdReached()).toBeTruthy()
  })

  it('should add the transaction to the pool', () => {
    expect(transactionPool.addTransaction(transaction))
      .toBeFalsy()

    expect(transactionPool.transactions.length).toEqual(1)
  })

  it('should check a transaction exists', () => {
    expect(transactionPool.transactionExists(transaction))
      .toBeFalsy()

    transactionPool.addTransaction(transaction)

    expect(transactionPool.transactionExists(transaction))
      .toBe(transaction)
  })

  it('should clear transactions', () => {
    transactionPool.addTransaction(transaction)
    transactionPool.addTransaction(transaction)
    transactionPool.addTransaction(transaction)

    expect(transactionPool.transactions.length).toEqual(3)

    transactionPool.clear()

    expect(transactionPool.transactions.length).toEqual(0)
  })
})
