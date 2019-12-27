import { v } from '..'

describe('object', () => {
    it('basic object validation', () => {
        const CarDto = v.class({
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

        const car = new CarDto(JSON.stringify({
            ...expected,
            tag: null,
        }))

        expect(car).toEqual(expected)
    })
})