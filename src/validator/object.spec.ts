import { v } from '..'

describe('object', () => {
    it('basic object validation', () => {
        const CarDto = v.class({
            model: v
                .String(),

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
            owner: {
                name: 'Elon',
                avatar: {
                    url: 'https://avatars/elon',
                }
            }
        }

        const car = new CarDto(JSON.stringify(expected))

        expect(car).toEqual(expected)
    })
})