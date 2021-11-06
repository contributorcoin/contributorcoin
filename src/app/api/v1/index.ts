import express from 'express'
import { blockchain, p2pServer, transactionPool, wallet } from '../..'
import PullRequestProcessor from '../../../processors/PullRequestProcessor'
import logger from '../../../utils/logger'
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
  res.json({ block: blockchain.getBlockByHash(req.params.hash) })
})

router.post('/create', (req, res) => {
  if (!transactionPool.transactions || !transactionPool.transactions.length) {
    logger('error', 'No transactions in the pool!')
    return res.send()
  }
  console.log('Creating block...')
  const block = blockchain.addBlock(transactionPool)
  logger('confirm', `New block added: ${block.toString()}`)
  p2pServer.syncChain()
  res.redirect('/blocks')
})

// Transactions
router.get('/transactions', (req, res) => {
  res.json(transactionPool.transactions)
})

router.post('/exchange', (req, res) => {
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
    logger('confirm', `New transaction added: ${transaction.toString()}`)
    p2pServer.broadcastTransaction(transaction)
    res.redirect('/transactions')
  }
})

router.post('/contribute', async (req, res) => {
  console.log('Creating contribution transaction(s)...')
  const { url } = req.body

  const transactions = await PullRequestProcessor.createTransactions(url)

  if (!transactions || !transactions.length) {
    logger('error', 'Unable to create transactions')
    res.send()
    return
  } else {
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i]

      transactionPool.addTransaction(transaction)
      logger(
        'confirm',
        `New contributor transaction added: ${transaction.toString()}`
      )
      p2pServer.broadcastTransaction(transaction)
    }

    res.redirect('/transactions')
  }
})

router.post('/stake', (req, res) => {
  console.log('Creating stake transaction...')
  const { to, amount, type } = req.body
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
