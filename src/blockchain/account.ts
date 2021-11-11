import { TransactionOptions } from '../utils/enums'

export default class Account {
  addresses: string[] // An array of all addresses
  balance: Balance    // An object with address balances

  constructor() {
    this.addresses = []
    this.balance = {}
  }

  // Initialize a new account
  initialize(address: string): void {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0
      this.addresses.push(address)
    }
  }

  // Transfer to accounts
  transfer(from: string, to: string, amount: number): void {
    this.initialize(from)
    this.initialize(to)
    this.increment(to, amount)
    this.decrement(from, amount)
  }

  // Increase receiver balance
  increment(to: (string | number), amount: number): void {
    this.balance[to] += amount
  }

  // Decrease sender balance
  decrement(from: string, amount: number): void {
    this.balance[from] -= amount
  }

  // Get the balance of an account
  getBalance(address: string): number {
    this.initialize(address)
    return this.balance[address]
  }

  // Initialize update of transactions
  update( transaction: any ): void {
    const amount = transaction.amount
    const from = transaction.from
    const to = transaction.to

    switch (transaction.type) {
    case (
      TransactionOptions.validation ||
        TransactionOptions.contribution ||
        TransactionOptions.approval
    ):
      this.increment(to, amount)
      break
    case 'exchange' || 'stake':
      if (from) {
        this.transfer(from, to, amount)
      } else {
        console.log('Invalid transaction details')
      }
    }
  }
}
