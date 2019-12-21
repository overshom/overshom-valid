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
})