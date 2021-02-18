import Transaction from './transaction'
import { TRANSACTION_THRESHOLD } from '../config'

export default class TransactionPool {
  transactions: Transaction[] // All transactions in the pool

  constructor() {
    this.transactions = []
  }

  // Check to see if pool threshold has been reached
  thresholdReached(): boolean {
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true
    }

    return false
  }

  // Add a transaction to the pool
  addTransaction(transaction: Transaction): boolean {
    this.transactions.push(transaction)

    return this.thresholdReached()
  }
}
