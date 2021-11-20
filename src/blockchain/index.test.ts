import Blockchain from '.'

const blockchain = new Blockchain()

describe('Blockchain', () => {

  it('should create a new blockchain class', () => {
    expect(blockchain).toMatchObject({
      chain: [
        {
          index: 0,
          lastHash: '----',
          hash: 'genesis-hash',
          data: [],
          validator: '',
          signature: ''
        }
      ],
      accounts: { addresses: [], balance: {} },
      stakes: { address: '', addresses: [], balance: {} },
      validators: { list: [] }
    })
  })
})
