import { v } from '.'

type TestTypes<A, B> = A extends B ? true : never

describe('types', () => {
    it('proper typings', () => {
        enum E { A, B }

        const ComplexDto = v.class({
            string: v.String(),
            number: v.Number(),
            bool: v.Boolean(),
            variadicObject: v.Record(v.Boolean()),
            object: v.Object({
                prop: v.Enum(E),
                object: v.Object({
                    prop: v.Number(),
                }),
            }),
        })

        const expectedTypeValue = {
            string: '',
            number: 0,
            bool: true,
            variadicObject: {
                foo: true,
                bar: false,
                other: true,
            } as {
                [key: string]: boolean
            },
            object: {
                prop: E.A,
                object: {
                    prop: 0,
                }
            }
        }

        const validationResult = new ComplexDto(expectedTypeValue)

        // this line will fail compilation in case of wrong validation return type
        const typeCheck: TestTypes<typeof validationResult, typeof expectedTypeValue> = true

        expect(typeCheck).toBe(true)
        expect(validationResult).toEqual(expectedTypeValue)
    })
})