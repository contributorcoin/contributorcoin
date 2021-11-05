// Blockchain

interface Balance {
  [key: string]: number
}

// Transactions

declare enum TransactionOptions {
  exchange = 'exchange',
  validation = 'validation',
  approval = 'approval',
  contribution = 'contribution',
  stake = 'stake'
}

declare enum GitProviders {
  github = 'github',
}

interface TransactionTypes {
  type?: TransactionOptions
  to: string
  amount: number
  signature: string
}

interface ContributionTypes extends TransactionTypes {
  provider: GitProviders
  owner: string
  repo: string
  pr: number
}

interface ExchangeTypes extends TransactionTypes {
  from: string
}

interface ValidationTypes extends TransactionTypes {
  hash: string
}
