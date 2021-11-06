import request from 'supertest'
import app from '../../../app'

describe('Blockchain API', () => {
  describe('POST /v1/contribute', () => {
    it('should return 400 when parameters are missing', (done) => {
      request(app)
        .post('/v1/contribute')
        .send({})
        .expect(({ body }) => {
          expect(body.error).toBeDefined()
          expect(body.details).toBeDefined()
        })
        .expect(400)
        .end(done)
    })

    it('should create contribution transactions', (done) => {
      request(app)
        .post('/v1/contribute')
        .send({
          // eslint-disable-next-line max-len
          url: 'https://github.com/contributorcoin/contributorcoin/commit/cb9f81fe84b9be70ce5cd022b907d62a730beb34'
        })
        .expect(({ body }) => {
          expect(body.data).toMatchObject({})
        })
        .expect(201)
        .end(done)
    })
  })

  // describe('POST /v1/exchange', () => {

  // })

  // describe('POST /v1/stake', () => {

  // })

  // describe('GET /v1/transactions', () => {

  // })

  // describe('POST /v1/create', () => {

  // })

  // describe('GET /v1/blocks', () => {

  // })

  // describe('GET /v1/block/:hash', () => {

  // })
})
