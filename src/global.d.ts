/* eslint-disable max-len */
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
declare type Transaction = import('./transactions/transaction').default
declare type ApprovalTransaction = import('./transactions/approval').default
declare type ContributionTransaction = import('./transactions/contribution').default
declare type ExchangeTransaction = import('./transactions/exchange').default
declare type StakeTransaction = import('./transactions/stake').default
declare type ValidationTransaction = import('./transactions/validation').default

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
