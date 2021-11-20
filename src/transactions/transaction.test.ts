import Transaction from './transaction'
import Wallet from '../wallet'

describe('Transaction', () => {
  const receiverWallet = new Wallet('receiver')
  const senderWallet = new Wallet('sender')
  const receiver = receiverWallet.getPublicKey()

  it('should return true with validation', () => {
    expect(Transaction.validate()).toBeTruthy()
  })

  it('should return a signature', () => {
    const signature = Transaction.signTransaction(receiver, 0, senderWallet)

    expect(signature).toEqual(
      // eslint-disable-next-line max-len
      '2561AB5A7176B588EE0BD13396EB030D5EEFB35694FD82157FC9F016DFCE37E1A1FE45AB59E56B64D6CFD0E25F33B0FD9B79ECFB246D4BECEF5CBB0392191802'
    )
  })
})
