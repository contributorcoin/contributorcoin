import SHA256 from 'crypto-js/sha256'

export default class Block {
  index: number
  timestamp: number
  lastHash: string
  hash: string
  data: string[]

  constructor(
    index: number,
    timestamp: number,
    lastHash: string,
    hash: string,
    data: string[]
  ) {
    this.index = index
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
  }

  // Stringify block data
  toString(): string {
    return `
    Index     : ${this.index}
    Timestamp : ${this.timestamp}
    Last Hash : ${this.lastHash}
    Hash      : ${this.hash}`
  }

  // Create Genesis block
  static genesis(): Block {
    const launchDate = new Date('2021-01-01').getTime()
    return new this(0, launchDate, '----', 'genesis-hash', [])
  }

  // Create a new block
  static createBlock(lastBlock: Block, data: string[]): Block {
    const index = lastBlock.index + 1
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = Block.hash(index, timestamp, lastHash, data)

    return new this(index, timestamp, lastHash, hash, data)
  }

  // Create block hash
  static hash(
    index: number,
    timestamp: number,
    lastHash: string,
    data: string[]
  ): string {
    return SHA256(
      JSON.stringify(`${index}${timestamp}${lastHash}${data}`)
    ).toString()
  }
}
