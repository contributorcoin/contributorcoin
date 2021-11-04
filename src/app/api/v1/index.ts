import express from 'express'
import { blockchain, p2pServer, transactionPool, wallet } from '../..'
import Transaction from '../../../wallet/transaction'
import Contribution from '../../../blockchain/contribution'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

const router = express.Router()

router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
)

// Blocks
router.get('/blocks', (req, res) => {
  res.json(blockchain.chain)
})

router.get('/block/:hash', (req, res) => {
  console.log(req.query)

  if (req.query && Object.keys(req.query).length) {
    if (req.query.index && typeof req.query.index === 'string') {
      const index = parseInt(req.query.index)
      res.json({ block: blockchain.getBlockByIndex(index) })
    }
  } else {
    res.json({ block: blockchain.getBlockByHash(req.params.hash) })
  }

})

// Transactions
router.get('/transactions', (req, res) => {
  res.json(transactionPool.transactions)
})

router.post('/create', (req, res) => {
  if (!transactionPool.transactions || !transactionPool.transactions.length) {
    console.log('✖️ No transactions in the pool!')
    return res.send()
  }
  console.log('Creating block...')
  const block = blockchain.addBlock(transactionPool)
  console.log(`✔️ New block added: ${block.toString()}`)
  p2pServer.syncChain()
  res.redirect('/blocks')
})

router.post('/transact', (req, res) => {
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
    p2pServer.broadcastTransaction(transaction)
    res.redirect('/transactions')
  }
})

router.post('/contribute', async (req, res) => {
  console.log('Creating contribution transactions...')
  const { url } = req.body

  const transactions = await Contribution.createContributions(url)

  if (!transactions || !transactions.length) {
    console.log('✖️ Unable to create transactions')
    res.send()
    return
  } else {
    transactions.forEach((transaction: Transaction) => {
      transactionPool.addTransaction(transaction)
      console.log(
        `✔️ New contributor transaction added: ${transaction.toString()}`
      )
      p2pServer.broadcastTransaction(transaction)
    })

    res.redirect('/transactions')
  }
})

// Wallet
router.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey })
})

router.get('/balance', (req, res) => {
  res.json({ balance: blockchain.getBalance(wallet.publicKey) })
})

router.get('/balance/:publicKey', (req, res) => {
  res.json({ balance: blockchain.getBalance(req.params.publicKey) })
})

export default router
