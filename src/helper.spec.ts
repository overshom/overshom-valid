import { v } from '.'
import { ValidationError } from './error'
import { CONSTRAINT_NAME } from './types'

export const expectValidationError = (fn: () => void, expectedError: ValidationError) => {
    try {
        fn()
        throw 'should throw validation error before this line'
    } catch (e) {
        expect(e instanceof ValidationError).toBe(true)
        expect(e.details).toMatchObject(expectedError.details)
    }
}

describe('helper', () => {
    it('handle validation error nicely', () => {
        const string = 'not a number'

        expectValidationError(() => {
            v.Number().validate(string)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
            receivedValue: string,
            receivedType: 'string'
        }))
    })
})