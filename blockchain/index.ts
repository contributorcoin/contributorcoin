import Block from './block'
import Account from './account'

export default class Blockchain {
  chain: Block[]
  accounts: Account

  constructor() {
    this.chain = [Block.genesis()]
    this.accounts = new Account()
  }

  // Add a new block to the blockchain
  addBlock(data: string[]): Block {
    const block = Block.createBlock(this.chain[this.chain.length - 1], data)

    this.chain.push(block)

    return block
  }

  getBalance(publicKey: string): number {
    return this.accounts.getBalance(publicKey)
  }
}
