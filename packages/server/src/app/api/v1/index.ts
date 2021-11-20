import express from 'express'
import { blockchain, p2pServer, transactionPool, wallet } from '../..'
import PullRequestProcessor from '../../../processors/PullRequestProcessor'
import swaggerUi from 'swagger-ui-express'
import { BadRequestError } from '../../../utils/error'
import swaggerDocument from './swagger.json'

const router = express.Router()

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Blocks
router.get('/blocks', (_req, res, next) => {
  try {
    const chain = blockchain.chain

    if (!chain) throw new BadRequestError('Blockchain could not be retrieved')

    res.status(200).json(chain)
  } catch(err) {
    next(err)
  }
})

router.get('/block/:hash', (req, res, next) => {
  try {
    const hash = req.params.hash

    if (!hash) throw new BadRequestError('No hash provided')

    if (typeof hash !== 'string') {
      throw new BadRequestError(
        'Provided value of "hash" is not a string'
      )
    }

    const block = blockchain.getBlockByHash(hash)

    if (!block) throw new BadRequestError('No block found with that hash')

    res.status(200).json(block)
  } catch(err) {
    next(err)
  }
})

router.post('/create', (_req, res, next) => {
  try {
    if (!transactionPool.transactions || !transactionPool.transactions.length) {
      throw new BadRequestError('No transactions in the pool')
    }

    const block = blockchain.addBlock(transactionPool)

    p2pServer.syncChain()

    res.status(201).json(block)
  } catch(err) {
    next(err)
  }
})

// Transactions
router.get('/transactions', (_req, res, next) => {
  try {
    res.status(200).json(transactionPool.transactions)
  } catch(err) {
    next(err)
  }
})

router.post('/exchange', (req, res, next) => {
  try {
    const { to, amount } = req.body

    if (!to) throw new BadRequestError('No receiver address provided')
    if (!amount) throw new BadRequestError('No amount provided')

    if (typeof to !== ('string' || 'number')) {
      throw new BadRequestError(
        'Provided value of "to" is not a string or number'
      )
    }

    if (typeof amount !== 'number') {
      throw new BadRequestError(
        'Provided value of "amount" is not a number'
      )
    }

    const transaction = wallet.createTransaction(
      'exchange',
      to,
      amount,
      blockchain,
      transactionPool
    )

    if (!transaction) {
      throw new BadRequestError('Unable to create transaction')
    } else {
      p2pServer.broadcastTransaction(transaction)
      res.status(201).json(transaction)
    }
  } catch(err) {
    next(err)
  }
})

router.post('/contribute', async (req, res, next) => {
  try {
    const { url } = req.body

    if (!url) return res.status(400).send('No url provided')

    if (typeof url !== 'string') {
      throw new BadRequestError(
        'Provided value of "url" is not a string'
      )
    }

    const transactions = await PullRequestProcessor.createTransactions(url)

    if (!transactions || !transactions.length) {
      throw new BadRequestError('Unable to create transaction(s)')
    } else {
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i]

        transactionPool.addTransaction(transaction)
        p2pServer.broadcastTransaction(transaction)
      }

      res.status(201).json(transactions)
    }
  } catch (err) {
    next(err)
  }
})

router.post('/stake', (req, _res, next) => {
  try {
    const { to, amount } = req.body

    if (!to) throw new BadRequestError('No receiver address provided')
    if (!amount) throw new BadRequestError('No amount provided')

    if (typeof to !== ('string' || 'number')) {
      throw new BadRequestError(
        'Provided value of "to" is not a string or number'
      )
    }

    if (typeof amount !== 'number') {
      throw new BadRequestError(
        'Provided value of "amount" is not a number'
      )
    }
  } catch(err) {
    next(err)
  }
})

// Wallet
router.get('/public-key', (_req, res, next) => {
  try {
    const publicKey = wallet.publicKey

    if (!publicKey) throw new BadRequestError('No key returned')

    res.status(200).json({ publicKey })
  } catch(err) {
    next(err)
  }
})

router.get('/balance', (_req, res, next) => {
  try {
    const balance = blockchain.getBalance(wallet.publicKey)

    if (!balance) throw new BadRequestError('No balance found')

    res.status(200).json({ balance })
  } catch(err) {
    next(err)
  }
})

router.get('/balance/:publicKey', (req, res, next) => {
  try {
    const publicKey = req.params.publicKey

    if (!publicKey) throw new BadRequestError('No public key provided')

    if (typeof publicKey !== 'string') {
      throw new BadRequestError(
        'Provided value of "publicKey" is not a string'
      )
    }

    const balance = blockchain.getBalance(publicKey)

    if (!balance) throw new BadRequestError('No balance found')

    res.status(200).json({ balance })
  } catch(err) {
    next(err)
  }
})

export default router
