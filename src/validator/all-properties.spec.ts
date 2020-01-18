import { v } from '..'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'
import { expectValidationError } from '../helper.spec'

describe('all properties', () => {
    it('base validation', () => {
        const obj = {
            foo: true,
            bar: false,
        }
        const validated = v.AllProperties(v.Boolean()).validate(obj)

        expect(validated).toEqual(obj)

        expectValidationError(() => {
            v.AllProperties(v.Number()).validate({
                foo: 'foo',
                bar: 'bar',
            })
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
        }))

        expectValidationError(() => {
            v.AllProperties(v.Number()).validate({
                foo: 1,
                bar: 'bar',
            })
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
        }))
    })
})