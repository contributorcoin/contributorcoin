import express from 'express'
import status from 'http-status'
import v1 from './v1'

const router = express.Router()

router.get('/healthcheck', (req, res) => {
  res.status(status.OK).send('OK')
})

router.get('/ping', (req, res) => {
  res.status(status.OK).send('PONG')
})

router.use('/v1', v1)

export default router
