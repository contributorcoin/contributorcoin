import WebSocket from 'ws'
import Blockchain from '../blockchain'
import Block from '../blockchain/block'
import Wallet from '../wallet'
import Transaction from '../wallet/transaction'
import TransactionPool from '../wallet/transaction-pool'

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

const MESSAGE_TYPE = {
  chain: 'CHAIN',
  block: 'BLOCK',
  transaction: 'TRANSACTION'
}

export default class P2PServer {
  blockchain: Blockchain
  sockets: WebSocket[]
  transactionPool: TransactionPool
  wallet: Wallet

  constructor(
    blockchain: Blockchain,
    transactionPool: TransactionPool,
    wallet: Wallet
  ) {
    this.blockchain = blockchain
    this.sockets = []
    this.transactionPool = transactionPool
    this.wallet = wallet
  }

  listen(): void {
    const server = new WebSocket.Server({ port: P2P_PORT })

    server.on('connection', socket => {
      this.connectSocket(socket)
    })
    this.connectToPeers()
    console.log(`Listening for peer to peer connections on port ${P2P_PORT}...`)
  }

  connectSocket(socket: WebSocket): void {
    this.sockets.push(socket)
    console.log('✔️ Socket connected')
    this.messageHandler(socket)
    this.closeConnectionHandler(socket)
    this.sendChain(socket)
  }

  connectToPeers(): void {
    peers.forEach(peer => {
      const socket = new WebSocket(peer)
      socket.on('open', () => this.connectSocket(socket))
    })
  }

  messageHandler(socket: WebSocket): void {
    socket.on('message', message => {
      const data = JSON.parse(message.toString())
      console.log('✔️ Received data from peer:', data.type)

      switch (data.type) {
      case MESSAGE_TYPE.chain:
        this.blockchain.replaceChain(data.chain)
        break

      case MESSAGE_TYPE.transaction:
        if (!this.transactionPool.transactionExists(data.transaction)) {
          let thresholdReached = null
          thresholdReached = this.transactionPool.addTransaction(
            data.transaction
          )
          this.broadcastTransaction(data.transaction)
          if (thresholdReached) {
            console.log(
              'The transaction threshold has been reached...'
            )
          }
        }
        if (this.transactionPool.thresholdReached()) {
          console.log('Creating block...')
          const block = this.blockchain.addBlock(
            this.transactionPool
          )
          console.log(`✔️ New block added: ${block.toString()}`)
          this.syncChain()
          this.broadcastBlock(block)
        }
        break

      case MESSAGE_TYPE.block:
        if (this.blockchain.isValidBlock(data.block, this.transactionPool)) {
          this.blockchain.addBlock(data.block)
          this.blockchain.executeTransactions(data.block)
          this.broadcastBlock(data.block)
          this.transactionPool.clear()
        }
        break
      }
    })
  }

  closeConnectionHandler(socket: WebSocket): void {
    socket.on('close', () => (
      socket
    ))
  }

  sendChain(socket: WebSocket): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.chain,
        chain: this.blockchain.chain
      })
    )
  }

  syncChain(): void {
    this.sockets.forEach(socket => {
      this.sendChain(socket)
    })
  }

  broadcastTransaction(transaction: Transaction): void {
    this.sockets.forEach(socket => {
      this.sendTransaction(socket, transaction)
    })
  }

  sendTransaction(socket: WebSocket, transaction: Transaction): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.transaction,
        transaction: transaction
      })
    )
  }

  broadcastBlock(block: Block): void {
    this.sockets.forEach(socket => {
      this.sendBlock(socket, block)
    })
  }

  sendBlock(socket: WebSocket, block: Block): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.block,
        block: block
      })
    )
  }
}
