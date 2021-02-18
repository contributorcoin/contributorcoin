import Block from './block'

export default class Blockchain {
  chain: Block[]

  constructor() {
    this.chain = [Block.genesis()]
  }

  // Add a new block to the blockchain
  addBlock(data: string[]): Block {
    const block = Block.createBlock(this.chain[this.chain.length - 1], data)

    this.chain.push(block)

    return block
  }
}
