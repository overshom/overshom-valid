import { CONSTRAINT_NAME } from './types'

export class ValidationError extends Error {
    constructor(public readonly details: {
        constraintName: CONSTRAINT_NAME
        constraintValue?: unknown
        receivedType?: unknown
        expectedType?: unknown
        receivedValue?: unknown
        key?: string
        caughtError?: unknown
    }) {
        super(`ValidationError: ${details.constraintName}`)
    }
}