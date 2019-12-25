import { v } from '..'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'
import { expectValidationError } from '../helper.spec'

describe('array', () => {
    it('base validation', () => {
        const array = [8, 3]
        const validated = v.Array(v.Number()).validate(array)

        expect(validated).toEqual(array)

        expectValidationError(() => {
            v.Array(v.Number()).validate(['some', 'string'])
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
        }))
    })
})