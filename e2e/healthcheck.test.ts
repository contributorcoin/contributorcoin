import request from 'supertest'
import app from '../src/app'

describe('Healthcheck API', () => {
  describe('GET /ping', () => {
    it('should return pong', (done) => {
      request(app)
        .get('/ping')
        .expect(({ text }: {text: string}) => {
          expect(text).toBe('PONG')
        })
        .expect(200)
        .end(done)
    })
  })

  describe('GET /healthcheck', () => {
    it('should return 200', (done) => {
      request(app)
        .get('/healthcheck')
        .expect(200)
        .end(done)
    })
  })
})
