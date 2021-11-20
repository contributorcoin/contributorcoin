import Wallet from '.'
import Blockchain from '../blockchain'
import TransactionPool from './transaction-pool'
import ExchangeTransaction from '../transactions/exchange'

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet('secret')
const receiverWallet = new Wallet('receiver')

describe('Wallet', () => {
  it('should create a new wallet from class', () => {
    expect(wallet).toMatchObject({
      secret: 'secret',
      balance: 0,
      publicKey:
        '12ff16c6c4f56a73922c23725f3b1f1d3958a03a981416d1e44231ff934c91fc',
    })
  })

  it('should return balance', () => {
    const balance = wallet.getBalance(blockchain)

    expect(balance).toEqual(0)
  })

  it('should return signed hex', () => {
    expect(wallet.sign('hash')).toEqual(
      // eslint-disable-next-line max-len
      'F02A66F594ECA08CEADAEE25D863EE5E405AEADBDE8FAA5235C94ED481714E8344379984D86838DCA505A067A939E6CF21681B15E7CA3E5A31DF69A78D02C60D'
    )
  })

  it('should return public key', () => {
    expect(wallet.getPublicKey()).toEqual(
      '12ff16c6c4f56a73922c23725f3b1f1d3958a03a981416d1e44231ff934c91fc'
    )
  })

  it('should create a transaction', () => {
    const transaction = wallet.createTransaction(
      'exchange',
      receiverWallet.getPublicKey(),
      0,
      blockchain,
      transactionPool,
    )

    expect(transaction).toBeInstanceOf(ExchangeTransaction)
  })
})
