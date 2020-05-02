import { v } from '..'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'
import { expectValidationError } from '../helper.spec'

describe('transform', () => {
    it('base validation', () => {
        const someValue = 'string'
        const rest = ['v', 5]
        const validated = v.Transform((v) => {
            if (typeof v !== 'string') {
                throw new Error('not a string')
            }
            return [v, ...rest]
        }).validate(someValue)

        expect(validated).toEqual([someValue, ...rest])

        expectValidationError(() => {
            v.Transform(() => {
                throw new Error('custom message')
            }).validate(0)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TRANSFORMATION_ERROR,
            caughtError: new Error('custom message'),
        }))
    })
})