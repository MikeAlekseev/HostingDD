import { ErrorRequestHandler, RequestHandler } from 'express'

const unexpectedRequest: RequestHandler = (req, res, next) => {
    res.status(404)
    res.end()
}

const defaultErrorHandler: ErrorRequestHandler = (error: Error, req, res, next) => {
    res.status(500)
    console.error(error)
    res.end()

    return
}

export const errorHandler = () => {
    return [unexpectedRequest, defaultErrorHandler]
}
