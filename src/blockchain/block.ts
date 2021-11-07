import SHA256 from 'crypto-js/sha256'
import ChainUtil from '../utils/chain-util'
import Wallet from '../wallet'
import Transaction from '../transactions/transaction'

export default class Block {
  index: number
  timestamp: number
  lastHash: string
  hash: string
  data: Transaction[]
  validator: string
  signature: string

  constructor(
    index: number,
    timestamp: number,
    lastHash: string,
    hash: string,
    data: Transaction[],
    validator: string,
    signature: string
  ) {
    this.index = index
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.validator = validator
    this.signature = signature
  }

  // Stringify block data
  toString(): string {
    return `
    Index     : ${this.index}
    Timestamp : ${this.timestamp}
    Last Hash : ${this.lastHash}
    Hash      : ${this.hash}
    Validator : ${this.validator}
    Signature : ${this.signature}`
  }

  // Create Genesis block
  static genesis(): Block {
    const launchDate = new Date('2021-01-01').getTime()
    return new this(0, launchDate, '----', 'genesis-hash', [], '', '')
  }

  // Create a new block
  static createBlock(
    lastBlock: Block,
    data: Transaction[],
    wallet: Wallet
  ): Block {
    const index = lastBlock.index + 1
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = Block.hash(index, timestamp, lastHash, data)
    const validator = wallet.getPublicKey()
    const signature = Block.signBlockHash(hash, wallet)

    return new this(
      index, timestamp, lastHash, hash, data, validator, signature
    )
  }

  // Create block hash
  static hash(
    index: number,
    timestamp: number,
    lastHash: string,
    data: Transaction[]
  ): string {
    return SHA256(
      JSON.stringify(`${index}${timestamp}${lastHash}${data}`)
    ).toString()
  }

  // Initialize block hash
  static blockHash(block: Block): string {
    const { index, timestamp, lastHash, data } = block
    return Block.hash(index, timestamp, lastHash, data)
  }

  // Sign the block
  static signBlockHash(hash: string, wallet: Wallet): string {
    return wallet.sign(hash)
  }

  // Verify the block signature
  static verifyBlock(block: Block): boolean {
    return ChainUtil.verifySignature(
      block.validator,
      block.signature,
      Block.hash(block.index, block.timestamp, block.lastHash, block.data)
    )
  }

  // Verify the lead validator
  static verifyLeader(block: Block, leader: string | undefined): boolean {
    return block.validator == leader ? true : false
  }
}
