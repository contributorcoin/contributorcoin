import Account from './account'
import ContributionTransaction from '../transactions/contribution'
import ExchangeTransaction from '../transactions/exchange'

const accounts = new Account()

describe('Account', () => {
  const addresses = [
    'gh:1234567890',
    'gh:0987654321',
  ]

  const contribution = new ContributionTransaction({
    to: addresses[0],
    amount: 10,
    signature: 'signature1234567890',
    provider: 'github',
    owner: 'contributorcoin',
    repo: 'contributorcoin',
    pr: 2,
  })

  const exchange = new ExchangeTransaction({
    from: addresses[1],
    to: addresses[0],
    amount: 15,
    signature: 'signature1234567890',
  })

  it('should create new account structure from class', () => {
    expect(accounts).toMatchObject({
      addresses: [],
      balance: {},
    })
  })

  it('should initialize new accounts', () => {
    accounts.initialize(addresses[0])
    accounts.initialize(addresses[1])

    expect(accounts.addresses.length).toEqual(2)
    expect(accounts.balance[addresses[0]]).toEqual(0)
    expect(accounts.balance[addresses[1]]).toEqual(0)
  })

  it('should not create a new account with same address', () => {
    accounts.initialize(addresses[0])

    expect(accounts.addresses.length).toEqual(2)
  })

  it('should increment account balances', () => {
    accounts.increment(addresses[0], 10)
    accounts.increment(addresses[1], 100)

    expect(accounts.balance[addresses[0]]).toEqual(10)
    expect(accounts.balance[addresses[1]]).toEqual(100)
  })

  it('should decrement account balances', () => {
    accounts.decrement(addresses[0], 2)
    accounts.decrement(addresses[1], 25)

    expect(accounts.balance[addresses[0]]).toEqual(8)
    expect(accounts.balance[addresses[1]]).toEqual(75)
  })

  it('should get the balance of the address', () => {
    expect(accounts.getBalance(addresses[0])).toEqual(8)
    expect(accounts.getBalance(addresses[1])).toEqual(75)
  })

  it('should transfer between accounts', () => {
    accounts.transfer(addresses[1], addresses[0], 25)

    expect(accounts.getBalance(addresses[0])).toEqual(33)
    expect(accounts.getBalance(addresses[1])).toEqual(50)
  })

  it('should update with transactions', () => {
    accounts.update(contribution)

    expect(accounts.getBalance(addresses[0])).toEqual(43)

    accounts.update(exchange)

    expect(accounts.getBalance(addresses[0])).toEqual(58)
    expect(accounts.getBalance(addresses[1])).toEqual(35)
  })
})
