export default class Stake {
  address: string
  addresses: string[]
  balance: Balance

  constructor() {
    this.address = ''
    this.addresses = []
    this.balance = {}
  }

  initialize(address: string): void {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0
      this.addresses.push(address)
    }
  }

  transfer(from: string, to:string, amount: number) {
    this.initialize(from)
    this.initialize(to)
    this.increment(to, amount)
    this.decrement(from, amount)
  }

  increment(to: string, amount: number) {
    this.balance[to] += amount
  }

  decrement(from: string, amount: number) {
    this.balance[from] -= amount
  }

  addStake(from: string, amount: number): void {
    this.initialize(from)
    this.balance[from] += amount
  }

  getBalance(address: string): number {
    this.initialize(address)
    return this.balance[address]
  }

  getMax(addresses: string[]): string | undefined {
    const balance = -1
    let leader = undefined
    addresses.forEach((address: string) => {
      if (this.getBalance(address) > balance) {
        leader = address
      }
    })
    return leader
  }

  update(transaction: StakeTransaction): void {
    if (transaction.amount && transaction.from) {
      const amount = transaction.amount
      const from = transaction.from
      this.addStake(from, amount)
    } else {
      throw new Error('Invalid sender credentials')
    }
  }
}
