export class GenericError extends Error{
  statusCode: number
  details?: Record<string, unknown>

  constructor(
    message: string,
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}

export class BadRequestError extends GenericError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400)
    this.details = details
  }
}
