/* eslint-disable max-len */

// Classes
declare type P2PServer = import('./app/p2p-server').default
declare type Peer = import('./app/peer').default

declare type Account = import('./blockchain/account').default
declare type Block = import('./blockchain/block').default
declare type Blockchain = import('./blockchain').default
declare type Stake = import('./blockchain/stake').default
declare type Validators = import('./blockchain/validators').default

declare type PullRequestProcessor = import('./processors/PullRequestProcessor').default
declare type GitProvider = import('./processors/providers').default
declare type Github = import('./processors/providers/github').default

declare type Transaction = import('./transactions').default
declare type ApprovalTransaction = import('./transactions/approval').default
declare type ContributionTransaction = import('./transactions/contribution').default
declare type ExchangeTransaction = import('./transactions/exchange').default
declare type StakeTransaction = import('./transactions/stake').default
declare type ValidationTransaction = import('./transactions/validation').default

declare type ChainUtil = import('./utils/chain-util').default

declare type Wallet = import('./wallet').default
declare type TransactionPool = import('./wallet/transaction-pool').default

// Blockchain

interface Balance {
  [key: string]: number
}

// Processors

declare type GitProviders = import('./utils/enums').GitProviders

interface PrData {
  provider: GitProviders
  owner: string
  repo: string
  pr: number
  signature: string
}

interface ContributionUsers {
  authors: (string | number)[]
  approvers: (string | number)[]
}

// Transactions

declare type TransactionOptions = import('./utils/enums').TransactionOptions

declare interface TransactionTypes {
  type?: TransactionOptions
  to: string | number
  amount: number
  signature: string
}

declare type ContributionTypes = TransactionTypes & PrData

interface ExchangeTypes extends TransactionTypes {
  from: string
}

interface ValidationTypes extends TransactionTypes {
  hash: string
}
