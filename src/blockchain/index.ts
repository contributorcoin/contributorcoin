import Block from './block'
import Account from './account'
import Stake from './stake'
import Validators from './validators'
import P2PServer from '../app/p2p-server'
import Wallet from '../wallet'
import { TransactionOptions } from '../utils/enums'
import ValidationTransaction from '../transactions/validation'
import TransactionPool from '../wallet/transaction-pool'
import config from '../config'
import logger from '../utils/logger'

const secret = 'i am the first leader'

export default class Blockchain {
  chain: Block[]          // The chain of all blocks
  accounts: Account       // All accounts on the blockchain
  stakes: Stake           // All stake accounts
  validators: Validators  // ALl validators

  constructor() {
    this.chain = [Block.genesis()]
    this.accounts = new Account()
    this.stakes = new Stake()
    this.validators = new Validators()
  }

  // Add a new block to the blockchain
  addBlock(transactionPool: TransactionPool): Block {
    const transactions = transactionPool.transactions
    const blockTransactions = transactions.splice(
      0, config.transactions.thresholdCount
    )

    const block = Block.createBlock(
      this.chain[this.chain.length - 1],
      blockTransactions,
      new Wallet(secret)
    )

    this.chain.push(block)

    return block
  }

  // Check that chain is valid
  isValidChain(chain: Block[]): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i = 0; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i - 1]

      if (
        (block.lastHash !== lastBlock.hash) ||
        (block.hash !== Block.blockHash(block))
      ) {
        return false
      }
    }

    return true
  }

  // Check to make sure block is valid
  isValidBlock(block: Block, transactionPool: TransactionPool): boolean {
    const lastBlock = this.chain[this.chain.length - 1]
    if (
      block.lastHash === lastBlock.hash &&
      block.hash === Block.blockHash(block) &&
      Block.verifyBlock(block) &&
      Block.verifyLeader(block, this.getLeader())
    ) {
      console.log('Block is valid')
      this.addBlock(transactionPool)
      this.executeTransactions(block)
      return true
    } else {
      return false
    }
  }

  // Replace with longer chain if available
  replaceChain(newChain: Block[]): void {
    if (newChain.length <= this.chain.length) {
      logger('confirm', 'Received chain is not longer than the current chain')
      return
    } else if (!this.isValidChain(newChain)) {
      logger('error', 'Received chain is invalid')
      return
    }

    console.log('Replacing the current chain with new chain...')
    this.resetState()
    this.executeChain(newChain)
    this.chain = newChain
  }

  // Execute transactions from blocks
  executeTransactions(block: Block): void {
    // block.data.forEach((transaction: AnyTransaction) => {
    //   switch (transaction.type) {
    //   case TransactionOptions.exchange:
    //     this.accounts.update(transaction)
    //     break
    //   case TransactionOptions.stake:
    //     this.stakes.update(transaction)
    //     if (transaction.from && transaction.amount) {
    //       this.accounts.decrement(
    //         transaction.from,
    //         transaction.amount
    //       )
    //     } else {
    //       logger('error', 'Invalid sender data')
    //     }
    //     break
    //   }
    // })
  }

  // Initialize execution of transactions on chain
  executeChain(chain: Block[]): void {
    chain.forEach(block => {
      this.executeTransactions(block)
    })
  }

  // Reset the blockchain state
  resetState(): void {
    this.chain = [Block.genesis()]
    this.accounts = new Account()
    this.stakes = new Stake()
    this.validators = new Validators()
  }

  // Get block by hash
  getBlockByHash(hash: string): Block | undefined {
    return this.chain.find(element => element.hash === hash)
  }

  // Get block by index
  getBlockByIndex(index: number): Block | undefined {
    return this.chain.find(element => element.index === index)
  }

  // Get the balance of an account
  getBalance(publicKey: string): number {
    return this.accounts.getBalance(publicKey)
  }

  // Get the leader of the validators
  getLeader(): string | undefined {
    return this.stakes.getMax(this.validators.list)
  }

  // Initialize accounts and stakes
  initialize(address: string): void {
    this.accounts.initialize(address)
    this.stakes.initialize(address)
  }

  // Create validator reward
  createValidatorReward(
    block: Block,
    transactionPool: TransactionPool,
    p2pserver: P2PServer
  ): void {
    const validator = block.validator

    console.log('Creating validator reward transaction...')
    const validatorTransaction = new ValidationTransaction({
      to: validator,
      amount: config.rewards.validation.total,
      signature: block.signature,
      hash: block.hash,
    })
    if (validatorTransaction) {
      transactionPool.addTransaction(validatorTransaction)
      logger(
        'confirm',
        `Validator reward transaction added:${validatorTransaction.toString()}`
      )
      p2pserver.broadcastTransaction(validatorTransaction)
    }
  }
}
