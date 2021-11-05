import Transaction from '../wallet/transaction'
import logger from '../utils/logger'

export default class Validators {
  list: string[]

  constructor() {
    this.list = []
  }

  update(transaction: Transaction): boolean {
    console.log(transaction)
    if (transaction.amount && transaction.to && transaction.from) {
      if (transaction.amount >= 25 && transaction.to == '0') {
        this.list.push(transaction.from)
        console.log('New Validator:', transaction.from)
        return true
      }
    }
    return false
  }
}
