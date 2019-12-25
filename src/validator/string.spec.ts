import { v } from '..'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'
import { expectValidationError } from '../helper.spec'

describe('string', () => {
    it('coercion', () => {
        const validator = v.String()

        const number = 7
        const string = validator.validate(number)
        expect(string).toBe(String(number))

        expectValidationError(() => {
            validator.validate({ foo: 'bar' })
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
        }))
    })

    it('min constraint', () => {
        const goodString = 'foo-bar'
        const minLimit = goodString.length
        const badString = goodString.slice(0, minLimit  - 1)
        const validator = v.String().min(minLimit)

        const goodResult = validator.validate(goodString)
        expect(goodResult).toBe(goodString)

        expectValidationError(() => {
            validator.validate(badString)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.MIN_LENGTH,
            constraintValue: minLimit,
        }))
    })

    it('max constraint', () => {
        const goodString = 'foo-bar'
        const maxLimit = goodString.length
        const badString = goodString + goodString
        const validator = v.String().max(maxLimit)

        const goodResult = validator.validate(goodString)
        expect(goodResult).toBe(goodString)

        expectValidationError(() => {
            validator.validate(badString)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.MAX_LENGTH,
            constraintValue: maxLimit,
        }))
    })

    it('pattern constraint', () => {
        const pattern = /^\w+$/
        const validator = v.String().pattern(pattern)

        const goodString = 'alphabet123'
        const badString = 'antipattern - string.'

        const goodResult = validator.validate(goodString)
        expect(goodResult).toBe(goodString)

        expectValidationError(() => {
            validator.validate(badString)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.PATTERN,
            constraintValue: pattern,
            receivedValue: badString,
        }))
    })
})