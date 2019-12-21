import { v } from '..'

describe('nested', () => {
    it('basic nested validation', () => {
        const CarDto = v.class({
            model: v
                .String(),

            owner: v.Nested({
                name: v
                    .String(),

                avatar: v.Nested({
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