import express, { Request, Response, NextFunction } from 'express'
import Blockchain from '../blockchain'
import bodyParser from 'body-parser'
import P2PServer from './p2p-server'
import Wallet from '../wallet'
import TransactionPool from '../wallet/transaction-pool'
import { GenericError } from '../utils/error'

const HTTP_PORT = process.env.HTTP_PORT || 3001
const app = express()
export const blockchain = new Blockchain()
export const wallet = new Wallet(Date.now().toString())
export const transactionPool = new TransactionPool()
export const p2pServer = new P2PServer(blockchain, transactionPool, wallet)

import api from './api'

app.use(bodyParser.json())

app.use('/', api)

if (process.env.NODE_ENV !== 'test') {
  app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}...`)
  })

  p2pServer.listen()
}

app.get('*', (req, _res, next) => {
  const error = new GenericError(
    `${req.ip} tried to access ${req.originalUrl}`,
    301
  )

  next(error)
})

app.use((
  error: GenericError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!error.statusCode) error.statusCode = 500

  // if (error.statusCode === 301) {
  //   return res.status(301).redirect('/not-found')
  // }

  return res.status(error.statusCode).json({ error: error.toString() })
})


export default app
