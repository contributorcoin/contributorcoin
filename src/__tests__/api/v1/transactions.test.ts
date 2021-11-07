import request from 'supertest'
import app, { transactionPool } from '../../../app'
import ValidationTransaction from '../../../transactions/validation'

describe('GET /v1/transactions', () => {

  it('should return empty pool', (done) => {
    request(app)
      .get('/v1/transactions')
      .expect(({ body }) => {
        expect(body).toEqual([])
      })
      .expect(200)
      .end(done)
  })

  it('should return new transaction from pool', (done) => {
    const data = {
      to: 'morganmspencer',
      amount: 10,
      signature: 'signature1234567890',
      hash: 'hash1234567890',
    }

    const transaction = new ValidationTransaction(data)

    transactionPool.addTransaction(transaction)

    request(app)
      .get('/v1/transactions')
      .expect(({ body }) => {
        expect(typeof body).toBe('object')

        for (let i = 0; i < body.length; i++) {
          const element = body[i]
          expect(element.type).toBe('validation')
        }
      })
      .expect(200)
      .end(done)
  })
})
