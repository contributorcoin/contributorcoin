import request from 'supertest'
import app, { transactionPool } from '../../..'
import ValidationTransaction from '../../../../transactions/validation'

describe('Blocks API', () => {
  describe('GET /v1/blocks', () => {
    it('should get blockchain', (done) => {
      request(app)
        .get('/v1/blocks')
        .expect(({ body }) => {
          expect(typeof body).toBe('object')
          expect(body.length).toBe(1)
          expect(body[0].hash).toBe('genesis-hash')
        })
        .expect(200)
        .end(done)
    })
  })

  describe('GET /v1/block/:hash', () => {
    it('should return 400 when nonexistent hash provided', (done) => {
      request(app)
        .get('/v1/block/32183129')
        .send({})
        .expect((body) => {
          expect(body.error).toBeDefined()
          if (body.error) {
            expect(body.error.text).toBeDefined()
          }
        })
        .expect(400)
        .end(done)
    })

    it('should return genesis block', (done) => {
      request(app)
        .get('/v1/block/genesis-hash')
        .expect(({ body }) => {
          expect(typeof body).toBe('object')
          expect(body.index).toBe(0)
        })
        .expect(200)
        .end(done)
    })
  })

  describe('POST /v1/create', () => {
    it('should return 400 when no transactions in pool', (done) => {
      request(app)
        .post('/v1/create')
        .expect((body) => {
          expect(body.error).toBeDefined()
          if (body.error) {
            expect(body.error.text).toBeDefined()
          }
        })
        .expect(400)
        .end(done)
    })

    it('should create a new block', (done) => {
      const data = {
        to: 'morganmspencer',
        amount: 10,
        signature: 'signature1234567890',
        hash: 'hash1234567890',
      }

      const transaction = new ValidationTransaction(data)

      transactionPool.addTransaction(transaction)

      request(app)
        .post('/v1/create')
        .expect(({ body }) => {
          expect(typeof body).toBe('object')
          expect(body.index).toBe(2)
          expect(body.data[0]).toMatchObject(data)
        })
        .expect(201)
        .end(done)
    })
  })
})
