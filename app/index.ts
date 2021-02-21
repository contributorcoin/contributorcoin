import express from 'express'
import Blockchain from '../blockchain'
import bodyParser from 'body-parser'
import P2PServer from './p2p-server'
import Wallet from '../wallet'
import TransactionPool from '../wallet/transaction-pool'
import Transaction from '../wallet/transaction'
import Contribution from '../blockchain/contribution'

const HTTP_PORT = process.env.HTTP_PORT || 3001
const app = express()
const blockchain = new Blockchain()
const wallet = new Wallet(Date.now().toString())
const transactionPool = new TransactionPool()
const p2pserver = new P2PServer(blockchain, transactionPool, wallet)

app.use(bodyParser.json())

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain)
})

app.post('/create', (req, res) => {
  if (!transactionPool.transactions || !transactionPool.transactions.length) {
    console.log('✖️ No transactions in the pool!')
    return res.send()
  }
  console.log('Creating block...')
  const block = blockchain.addBlock(transactionPool)
  console.log(`✔️ New block added: ${block.toString()}`)
  p2pserver.syncChain()
  res.redirect('/blocks')
})

app.get('/transactions', (req, res) => {
  res.json(transactionPool.transactions)
})

app.post('/transact', (req, res) => {
  console.log('Creating transaction...')
  const { to, amount, type } = req.body
  const transaction = wallet.createTransaction(
    type,
    to,
    amount,
    blockchain,
    transactionPool
  )
  if (transaction) {
    console.log(`✔️ New transaction added: ${transaction.toString()}`)
    p2pserver.broadcastTransaction(transaction)
    res.redirect('/transactions')
  }
})

app.post('/contribute', async (req, res) => {
  console.log('Creating contribution transactions...')
  const { url } = req.body

  const transactions = await Contribution.createContributions(url)

  if (!transactions) {
    console.log('✖️ Invalid contribution data!')
    res.send()
    return
  }

  if (transactions && transactions.length) {

    if (transactions && transactions.length) {
      transactions.forEach((transaction: Transaction) => {
        transactionPool.addTransaction(transaction)
        console.log(
          `✔️ New contributor transaction added: ${transaction.toString()}`
        )
        p2pserver.broadcastTransaction(transaction)
      })
    }

    res.redirect('/transactions')
  } else {
    console.log('✖️ Invalid contribution data!')
    res.send()
    return
  }
})

app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey })
})

app.get('/balance', (req, res) => {
  res.json({ balance: blockchain.getBalance(wallet.publicKey) })
})

app.get('/balance/:publicKey', (req, res) => {
  res.json({ balance: blockchain.getBalance(req.params.publicKey) })
})

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}...`)
})

p2pserver.listen()
