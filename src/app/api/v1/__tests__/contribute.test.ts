import request from 'supertest'
import app from '../../..'

describe('POST /v1/contribute', () => {
  it('should return 400 when parameters are missing', (done) => {
    request(app)
      .post('/v1/contribute')
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

  it('should create contribution transactions', (done) => {
    request(app)
      .post('/v1/contribute')
      .send({
        // eslint-disable-next-line max-len
        url: 'https://github.com/contributorcoin/contributorcoin/commit/cb9f81fe84b9be70ce5cd022b907d62a730beb34'
      })
      .expect(({ body }) => {
        expect(typeof body).toBe('object')

        for (let i = 0; i < body.length; i++) {
          const element = body[i]
          expect(element.type).toBe('contribution' || 'approval')
        }
      })
      .expect(201)
      .end(done)
  })
})
