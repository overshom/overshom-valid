import { v } from '..'

describe('string', () => {
    it('basic validation', () => {
        enum USER_ROLE {
            USER = 'USER',
            ADMIN = 'ADMIN',
        }

        const UserDto = v.class({
            login: v
                .String()
                .min(4)
                .max(16)
                .pattern(/^\w+$/),

            role: v.Nested({
                type: v.Enum(USER_ROLE)
            }),

            avatar: v
                .String()
                .optional(),
        })

        const user = new UserDto(`{
            "login": "overshom",
            "role": {
                "type": "ADMIN"
            }
        }`)

        expect(user).toEqual({
            login: 'overshom',
            role: {
                type: USER_ROLE.ADMIN,
            },
        })
    })
})