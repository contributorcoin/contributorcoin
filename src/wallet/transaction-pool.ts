import config from '../config'

export default class TransactionPool {
  transactions: AnyTransaction[] // All transactions in the pool

  constructor() {
    this.transactions = []
  }

  // Check to see if pool threshold has been reached
  thresholdReached(): boolean {
    if (this.transactions.length >= config.transactions.thresholdCount) {
      return true
    }

    return false
  }

  // Add a transaction to the pool
  addTransaction(transaction: AnyTransaction): boolean {
    this.transactions.push(transaction)

    return this.thresholdReached()
  }

  // Verify that the transaction exists
  transactionExists(transaction: AnyTransaction): AnyTransaction | undefined {
    const exists = this.transactions.find(t => t.id === transaction.id)
    return exists
  }

  // Clear the transaction pool
  clear(): void {
    this.transactions = []
  }
}
