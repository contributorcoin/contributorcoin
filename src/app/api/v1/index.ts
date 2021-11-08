import express from 'express'
import { blockchain, p2pServer, transactionPool, wallet } from '../..'
import PullRequestProcessor from '../../../processors/PullRequestProcessor'
import { TransactionOptions } from '../../../utils/enums'
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
  try {
    const chain = blockchain.chain

    if (!chain) throw new Error('Blockchain could not be retrieved')

    res.status(200).json(chain)
  } catch(err) {
    res.status(400).send(String(err))
  }
})

router.get('/block/:hash', (req, res) => {
  const hash = req.params.hash

  if (!hash) return res.status(400).send('No hash provided')

  if (typeof hash !== 'string') {
    return res.status(400).send(
      'Provided value of \'hash\' is not a string'
    )
  }

  try {
    const block = blockchain.getBlockByHash(hash)

    if (!block) throw new Error('No block found with that hash')

    res.status(200).json(block)
  } catch(err) {
    res.status(400).send(String(err))
  }
})

router.post('/create', (req, res) => {
  if (!transactionPool.transactions || !transactionPool.transactions.length) {
    res.status(400).send('No transactions in the pool')
  }

  try {
    const block = blockchain.addBlock(transactionPool)

    p2pServer.syncChain()

    res.status(201).json(block)
  } catch(err) {
    res.status(400).send(String(err))
  }
})

// Transactions
router.get('/transactions', (req, res) => {
  try {
    res.status(200).json(transactionPool.transactions)
  } catch(err) {
    res.status(400).send(String(err))
  }
})

router.post('/exchange', (req, res) => {
  const { to, amount } = req.body

  if (!to) return res.status(400).send('No receiver address provided')
  if (!amount) return res.status(400).send('No amount provided')

  if (typeof to !== ('string' || 'number')) {
    return res.status(400).send(
      'Provided value of \'to\' is not a string or number'
    )
  }

  if (typeof amount !== 'number') {
    return res.status(400).send(
      'Provided value of \'amount\' is not a number'
    )
  }

  try {
    const transaction = wallet.createTransaction(
      TransactionOptions.exchange,
      to,
      amount,
      blockchain,
      transactionPool
    )

    if (!transaction) {
      throw new Error('Unable to create transaction')
    } else {
      p2pServer.broadcastTransaction(transaction)
      res.status(201).json(transaction)
    }
  } catch(err) {
    res.status(400).send(String(err))
  }
})

router.post('/contribute', async (req, res) => {
  const { url } = req.body

  if (!url) return res.status(400).send('No url provided')

  if (typeof url !== 'string') {
    return res.status(400).send(
      'Provided value of \'url\' is not a string'
    )
  }

  try {
    const transactions = await PullRequestProcessor.createTransactions(url)

    if (!transactions || !transactions.length) {
      throw new Error('Unable to create transaction(s)')
    } else {
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i]

        transactionPool.addTransaction(transaction)
        p2pServer.broadcastTransaction(transaction)
      }

      res.status(201).json(transactions)
    }
  } catch (err) {
    res.status(400).send(String(err))
  }
})

router.post('/stake', (req, res) => {
  const { to, amount } = req.body

  if (!to) return res.status(400).send('No receiver address provided')
  if (!amount) return res.status(400).send('No amount provided')

  if (typeof to !== ('string' || 'number')) {
    return res.status(400).send(
      'Provided value of \'to\' is not a string or number'
    )
  }

  if (typeof amount !== 'number') {
    return res.status(400).send(
      'Provided value of \'amount\' is not a number'
    )
  }
})

// Wallet
router.get('/public-key', (req, res) => {
  const publicKey = wallet.publicKey

  if (!publicKey) return res.status(400).send('No key returned')

  res.status(200).json({ publicKey })
})

router.get('/balance', (req, res) => {
  const balance = blockchain.getBalance(wallet.publicKey)

  if (!balance) return res.status(400).send('No balance found')

  res.status(200).json({ balance })
})

router.get('/balance/:publicKey', (req, res) => {
  const publicKey = req.params.publicKey

  if (!publicKey) return res.status(400).send('No public key provided')

  if (typeof publicKey !== 'string') {
    return res.status(400).send(
      'Provided value of \'publicKey\' is not a string'
    )
  }

  try {
    const balance = blockchain.getBalance(publicKey)

    if (!balance) return res.status(400).send('No balance found')

    res.status(200).json({ balance })
  } catch(err) {
    res.status(400).send(String(err))
  }
})

export default router
