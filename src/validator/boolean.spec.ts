import { v } from '..'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'
import { expectValidationError } from '../helper.spec'

describe('boolean', () => {
    it('coercion', () => {
        const stringTrue = 'true'
        const stringFalse = 'false'
        const arbitraryString = 'arbitrary string'
        const goodTrueResult = v.Boolean().validate(stringTrue)
        const goodFalseResult = v.Boolean().validate(stringFalse)

        expect(goodTrueResult).toBe(true)
        expect(goodFalseResult).toBe(false)

        expectValidationError(() => {
            v.Boolean().validate(arbitraryString)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.INVALID_BOOLEAN_VALUE,
        }))

        expectValidationError(() => {
            v.Boolean().validate('arbitrary string')
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.INVALID_BOOLEAN_VALUE,
        }))
    })
})