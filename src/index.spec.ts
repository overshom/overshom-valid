import { v } from '.'

describe('valid', () => {
    it('extendable by class', () => {
        class UserDto extends v.class({
            name: v.String(),
        }) { }

        const user = new UserDto({
            name: 'username'
        })

        expect(user).toBeInstanceOf(UserDto)
        expect(user).toEqual({ name: 'username' })
    })

    it('transformation method', () => {
        const incrementer = (n: number) => n + 1
        const validator = v.Number().transform(incrementer)

        const initialValue = 10
        const expected = incrementer(initialValue)
        const result = validator.validateAndTransform(initialValue)

        expect(result).toBe(expected)
    })
})