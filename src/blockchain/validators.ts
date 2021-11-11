export default class Validators {
  list: string[]

  constructor() {
    this.list = []
  }

  update(transaction: (ExchangeTransaction | StakeTransaction)): boolean {
    if (transaction.amount && transaction.to && transaction.from) {
      if (transaction.amount >= 25 && transaction.to == '0') {
        this.list.push(transaction.from)
        return true
      }
    }
    return false
  }
}
