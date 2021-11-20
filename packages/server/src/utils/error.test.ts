import { GenericError, BadRequestError } from './error'

describe('Errors', () => {
  const message = 'This is a message'

  describe('Generic error', () => {
    it('should create a generic error', () => {
      const error = new GenericError(message, 301)

      expect(error).toBeInstanceOf(GenericError)
      expect(error).toMatchObject({message, statusCode: 301})
    })
  })

  describe('Bad request error', () => {
    it('should create a bad request error', () => {
      const error = new BadRequestError(message)

      expect(error).toBeInstanceOf(BadRequestError)
      expect(error).toMatchObject({message, statusCode: 400})
    })
  })
})
