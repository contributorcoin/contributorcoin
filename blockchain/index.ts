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

  // Get the balance of an account
  getBalance(publicKey: string): number {
    return this.accounts.getBalance(publicKey)
  }
}
