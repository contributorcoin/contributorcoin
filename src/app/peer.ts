export default class Peer {
  blockchain: Blockchain
  p2pServer: P2PServer
  wallet: Wallet
  transactionPool: TransactionPool

  constructor(
    blockchain: Blockchain,
    p2pServer: P2PServer,
    wallet: Wallet,
    transactionPool: TransactionPool
  ) {
    this.blockchain = blockchain
    this.p2pServer = p2pServer
    this.wallet = wallet
    this.transactionPool = transactionPool
  }
}
