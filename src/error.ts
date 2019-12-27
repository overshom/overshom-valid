import { CONSTRAINT_NAME } from './types'

export type ErrorDetails = {
    constraintName: CONSTRAINT_NAME
    constraintValue?: unknown
    receivedType?: unknown
    expectedType?: unknown
    receivedValue?: unknown
    key?: string
    caughtError?: unknown
    accumulativeDetails?: ErrorDetails[]
}

export class ValidationError extends Error {
    constructor(public readonly details: ErrorDetails) {
        super(`ValidationError: ${details.constraintName}`)
    }
}