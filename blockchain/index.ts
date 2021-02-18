import Block from './block'
import Account from './account'
import Transaction, { TransactionType } from '../wallet/transaction'
import TransactionPool from '../wallet/transaction-pool'
import {
  TRANSACTION_THRESHOLD,
  COMMITTER_REWARD,
  CONTRIBUTOR_REWARD
} from '../config'

export default class Blockchain {
  chain: Block[]    // The chain of all blocks
  accounts: Account // All accounts on the blockchain

  constructor() {
    this.chain = [Block.genesis()]
    this.accounts = new Account()
  }

  // Add a new block to the blockchain
  addBlock(transactionPool: TransactionPool): Block {
    const transactions = transactionPool.transactions
    const blockTransactions = transactions.splice(0, TRANSACTION_THRESHOLD)

    const block = Block.createBlock(
      this.chain[this.chain.length - 1],
      blockTransactions
    )

    this.chain.push(block)

    return block
  }

  // Create a new contribution transactions
  createContributions(
    committer: string | null,
    contributor: string | null,
    url: string
  ): Transaction[] {
    const transactions = []

    // TODO: Add validations before rewards

    // Create comitter reward
    if (committer) {
      const committerTransaction = Transaction.newTransaction(
        TransactionType.committerReward, null, committer, COMMITTER_REWARD
      )

      if (committerTransaction) {
        transactions.push(committerTransaction)
      }
    }

    // Create contributor reward
    if (contributor) {
      const contributorTransaction = Transaction.newTransaction(
        TransactionType.contributorReward, null, contributor, CONTRIBUTOR_REWARD
      )

      if (contributorTransaction) {
        transactions.push(contributorTransaction)
      }
    }

    return transactions
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
      block.hash === Block.blockHash(block)
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
      console.log('✔️ Received chain is not longer than the current chain')
      return
    } else if (!this.isValidChain(newChain)) {
      console.log('✖️ Received chain is invalid')
      return
    }

    console.log('Replacing the current chain with new chain...')
    this.resetState()
    this.executeChain(newChain)
    this.chain = newChain
  }

  // Execute transactions from blocks
  executeTransactions(block: Block): void {
    block.data.forEach((transaction: Transaction) => {
      switch (transaction.type) {
      case TransactionType.transaction:
        this.accounts.update(transaction)
        break
      }
    })
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
  }

  // Get the balance of an account
  getBalance(publicKey: string): number {
    return this.accounts.getBalance(publicKey)
  }
}
