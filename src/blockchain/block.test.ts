import Block from './block'
import Wallet from '../wallet'

describe('Block', () => {
  const data = {
    index: 1,
    timestamp: new Date().getTime(),
    lastHash: 'genesis-hash',
    hash: 'hash1234567890',
    data: [],
    validator: 'morganmspencer',
    signature: 'signature1234567890',
  }

  const block = new Block(
    data.index,
    data.timestamp,
    data.lastHash,
    data.hash,
    data.data,
    data.validator,
    data.signature
  )

  it('should generate the genesis block', () => {
    const genesis = Block.genesis()

    expect(genesis).toBeInstanceOf(Block)
    expect(genesis).toMatchObject({
      index: 0,
      lastHash: '----',
      hash: 'genesis-hash',
      data: [],
      validator: '',
      signature: ''
    })
  })

  it('should generate a new basic block', () => {
    expect(block).toBeInstanceOf(Block)
    expect(block).toMatchObject(data)
  })

  it('should generate a new block from previous', () => {
    const wallet = new Wallet(Date.now().toString())
    const newBlock = Block.createBlock(
      block,
      [],
      wallet
    )

    expect(newBlock).toBeInstanceOf(Block)
    expect(newBlock).toMatchObject({
      index: 2,
      lastHash: 'hash1234567890',
    })
  })

  it('should create a block hash', () => {
    const data = {
      index: 23,
      timestamp: new Date().getTime(),
      lastHash: 'hash1234567890',
      data: [],
    }

    const hash = Block.hash(
      data.index,
      data.timestamp,
      data.lastHash,
      data.data
    )

    expect(hash.length).toEqual(64)
  })

  it('should create a hash from a block', () => {
    const hash = Block.blockHash(block)

    expect(hash.length).toEqual(64)
  })

  it('should sign block hash', () => {
    const wallet = new Wallet(Date.now().toString())
    const hash = Block.blockHash(block)

    const signature = Block.signBlockHash(hash, wallet)

    expect(signature.length).toEqual(128)
  })
})
