import ChainUtil from './chain-util'

describe('Chain util', () => {
  // it('should generate key pair', () => {
  //   const keyPair = ChainUtil.genKeyPair(Date.now().toString())
  //   expect(keyPair).toBeInstanceOf(KeyPair)
  // })

  it('should generate UUID', () => {
    const uuid = ChainUtil.id()
    const v4 = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    )

    expect(uuid).toMatch(v4)
  })

  it('should generate hash', () => {
    const hash = ChainUtil.hash('hash my data')

    expect(hash)
      .toBe('613873f3631d24eda8f8cf5b18701b454df00999a32e27e2b8bbc76d70ad6598')
  })
})
