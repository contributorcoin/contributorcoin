import Transaction from '../wallet/transaction'

interface Balance {
  [key: string]: number
}

export default class Account {
  addresses: string[]
  balance: Balance

  constructor() {
    this.addresses = []
    this.balance = {}
  }

  initialize(address: string): void {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0
      this.addresses.push(address)
    }
  }

  getBalance(address: string): number {
    this.initialize(address)
    return this.balance[address]
  }
}
