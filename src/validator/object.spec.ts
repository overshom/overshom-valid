import { v } from '..'
import { expectValidationError } from '../helper.spec'
import { ValidationError } from '../error'
import { CONSTRAINT_NAME } from '../types'
import { logger } from '../logger'

describe('object', () => {
    beforeAll(() => {
        logger.muteLogs()
    })

    afterAll(() => {
        logger.unmuteLogs()
    })

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

    it('optional property', () => {
        const validator = v.Object({
            tag: v.String(),
            tagFromUndefined: v.Number().optional(),
            tagFromNull: v.Number().optional(),
            tagOptional: v.Number().optional(),
            tagDefault: v.Number().optional(77),
        })

        const result = validator.validate({
            tag: 'tag',
            tagFromUndefined: undefined,
            tagFromNull: null,
            tagOptional: 9,
        })

        expect(result).toEqual({
            tag: 'tag',
            tagOptional: 9,
            tagFromUndefined: undefined,
            tagFromNull: undefined,
            tagDefault: 77,
        })
    })

    it('nested validation', () => {
        const expected = {
            model: 'TESLA',
            owner: {
                name: 'Elon',
                avatar: {
                    url: 'https://avatars/elon',
                }
            }
        }

        const validator = v.Object({
            model: v.String(),
            owner: v.Object({
                name: v.String(),
                avatar: v.Object({
                    url: v.String(),
                }),
            }),
        })

        const car = validator.validate(JSON.stringify(expected))

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

    it('transform and nested validation', () => {
        const numbers = [1, 3, 7]
        const numberDoubler = (n: number) => n * 2
        const arrayNumberDoubler = (arr: number[]) => arr.map(numberDoubler)

        const expected = {
            numbers: arrayNumberDoubler(numbers),
            foo: {
                bar: {
                    innerNumbers: arrayNumberDoubler(numbers),
                    originalNumbers: numbers,
                }
            }
        }

        const validator = v.Object({
            numbers: v.Array(v.Number().transform(numberDoubler)),
            foo: v.Object({
                bar: v.Object({
                    innerNumbers: v.Array(v.Number().transform(numberDoubler)),
                    originalNumbers: v.Array(v.Number()),
                }),
            }),
        })

        const car = validator.validate(expected)

        expect(car).toEqual(expected)
    })
})