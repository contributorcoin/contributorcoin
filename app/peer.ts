import Blockchain from '../blockchain'
import P2PServer from './p2p-server'
import Wallet from '../wallet'
import TransactionPool from '../wallet/transaction-pool'

export default class Peer {
  blockchain: Blockchain
  p2pserver: P2PServer
  wallet: Wallet
  transactionPool: TransactionPool

  constructor(
    blockchain: Blockchain,
    p2pserver: P2PServer,
    wallet: Wallet,
    transactionPool: TransactionPool
  ) {
    this.blockchain = blockchain
    this.p2pserver = p2pserver
    this.wallet = wallet
    this.transactionPool = transactionPool
  }
}
