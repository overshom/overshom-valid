import { v } from '..'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'
import { expectValidationError } from '../helper.spec'

describe('number', () => {
    it('coercion', () => {
        const goodNumber = 7
        const result = v.Number().validate(String(goodNumber))

        expect(result).toBe(goodNumber)

        expectValidationError(() => {
            v.Number().validate({ foo: 'bar' })
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
        }))

        expectValidationError(() => {
            v.Number().validate('arbitrary string')
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
        }))
    })

    it('min constraint', () => {
        const minLimit = 5
        const validator = v.Number().min(minLimit)
        const goodNumber = validator.validate(minLimit)

        expect(goodNumber).toBe(minLimit)

        expectValidationError(() => {
            validator.validate(minLimit - 1)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.MIN_NUMBER,
            constraintValue: minLimit,
        }))
    })

    it('max constraint', () => {
        const maxLimit = 5
        const validator = v.Number().max(maxLimit)
        const goodNumber = validator.validate(maxLimit)

        expect(goodNumber).toBe(maxLimit)

        expectValidationError(() => {
            validator.validate(maxLimit + 1)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.MAX_NUMBER,
            constraintValue: maxLimit,
        }))
    })
})