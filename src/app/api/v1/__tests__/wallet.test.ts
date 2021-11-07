import request from 'supertest'
import app, {
  // blockchain,
  // p2pServer,
  // transactionPool,
  wallet
} from '../../..'
// import ValidationTransaction from '../../../../transactions/validation'

describe('Wallet API', () => {
  describe('GET /v1/public-key', () => {
    it('should get wallet public key', (done) => {
      request(app)
        .get('/v1/public-key')
        .expect(({ body }) => {
          expect(typeof body).toBe('object')
          expect(typeof body.publicKey).toBe('string')
        })
        .expect(200)
        .end(done)
    })
  })

  describe('GET /v1/balance', () => {
    it('should get no balance from current wallet', (done) => {
      request(app)
        .get('/v1/balance')
        .expect((body) => {
          expect(body.error).toBeDefined()
          if (body.error) {
            expect(body.error.text).toBeDefined()
          }
        })
        .expect(400)
        .end(done)
    })

    it('should get no balance from current wallet by public key', (done) => {
      request(app)
        .get(`/v1/balance/${wallet.publicKey}`)
        .expect((body) => {
          expect(body.error).toBeDefined()
          if (body.error) {
            expect(body.error.text).toBeDefined()
          }
        })
        .expect(400)
        .end(done)
    })

    // it('should get balance from current wallet', (done) => {
    //   const data = {
    //     to: wallet.publicKey,
    //     amount: 10,
    //     signature: 'signature1234567890',
    //     hash: 'hash1234567890',
    //   }

    //   const transaction = new ValidationTransaction(data)

    //   transactionPool.addTransaction(transaction)

    //   blockchain.addBlock(transactionPool)

    //   p2pServer.syncChain()

    //   request(app)
    //     .get('/v1/balance')
    //     .expect((body) => {
    //       // console.log(body)
    //     })
    //     .expect(200)
    //     .end(done)
    // })
  })
})
