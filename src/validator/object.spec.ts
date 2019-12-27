import { v } from '..'
import { expectValidationError } from '../helper.spec'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'

describe('object', () => {
    it('from string', () => {
        const car = {
            model: 'TESLA'
        }

        const valid = v.Object({
            model: v.String(),
        }).validate(JSON.stringify(car))

        expect(valid).toEqual(car)

        expectValidationError(() => {
            v.Object({}).validate('bla')
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.SOURCE_PARSE_FAIL,
        }))
    })

    it('from object', () => {
        const car = {
            model: 'TESLA'
        }

        const valid = v.Object({
            model: v.String(),
        }).validate(car)

        expect(valid).toEqual(car)

        expectValidationError(() => {
            v.Object({}).validate(777)
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.SOURCE_NOT_OBJECT,
        }))
    })

    it('nested validation', () => {
        const expected = {
            model: 'TESLA',
            tag: undefined,
            owner: {
                name: 'Elon',
                avatar: {
                    url: 'https://avatars/elon',
                }
            }
        }

        const validator = v.Object({
            model: v
                .String(),

            tag: v
                .String()
                .optional(),

            owner: v.Object({
                name: v
                    .String(),

                avatar: v.Object({
                    url: v
                        .String(),
                }),
            }),
        })

        const car = validator.validate(JSON.stringify({
            ...expected,
            tag: null,
        }))

        expect(car).toEqual(expected)

        expectValidationError(() => {
            validator.validate({
                owner: {
                    avatar: {},
                },
            })
        }, new ValidationError({
            constraintName: CONSTRAINT_NAME.ACCUMULATIVE_ERROR,
        }))

        try {
            validator.validate({
                owner: {
                    avatar: {},
                },
            })
            throw 'fail'
        } catch (e) {
            expect(e instanceof ValidationError).toBe(true)
            const ve = e as ValidationError
            expect(ve.details.accumulativeDetails?.length).toBe(3)
        }
    })
})