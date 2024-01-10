class ApiError extends Error {
  statusCode: number
  success: boolean

  constructor(statusCode: number, message = "Something went wrong") {
    super(message)
    this.statusCode = statusCode
    this.success = false

    // Override the default Error constructor
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export { ApiError }
