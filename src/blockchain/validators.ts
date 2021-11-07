import ExchangeTransaction from '../transactions/exchange'
import StakeTransaction from '../transactions/stake'

export default class Validators {
  list: string[]

  constructor() {
    this.list = []
  }

  update(transaction: (ExchangeTransaction | StakeTransaction)): boolean {
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
