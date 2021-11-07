import request from 'supertest'
import app from '../../..'
// import ExchangeTransaction from '../../../../transactions/exchange'

describe('POST /v1/exchange', () => {
  it('should return 400 when parameters are missing', (done) => {
    request(app)
      .post('/v1/exchange')
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

  // it('should create an exchange transaction', (done) => {
  //   request(app)
  //     .post('/v1/exchange')
  //     .send({
  //       to: 'morganmspencer',
  //       amount: 10,
  //     })
  //     .expect(({ body }) => {
  //       console.log(body)
  //
  //     })
  //     .expect(201)
  //     .end(done)
  // })
})
