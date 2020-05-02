import { v } from '..'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'
import { expectValidationError } from '../helper.spec'

describe('record', () => {
    it('base validation', () => {
        const obj = {
            foo: true,
            bar: false,
        }
        const validated = v.Record(v.Boolean()).validate(obj)

        expect(validated).toEqual(obj)

        expectValidationError(() => {
            v.Record(v.Number()).validate({
                foo: 'foo',
                bar: 'bar',
            })
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
        }))

        expectValidationError(() => {
            v.Record(v.Number()).validate({
                foo: 1,
                bar: 'bar',
            })
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
        }))
    })
})