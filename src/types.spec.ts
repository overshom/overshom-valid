import { v } from '.'

type TestTypes<A, B> = A extends B ? true : never

describe('types', () => {
    it('proper typings', () => {
        enum E { A, B }

        const ComplexDto = v.class({
            string: v.String(),
            number: v.Number(),
            bool: v.Boolean(),
            nested: v.Nested({
                prop: v.Enum(E),
                nested: v.Nested({
                    prop: v.Number(),
                }),
            }),
        })

        const expectedTypeValue = {
            string: '',
            number: 0,
            bool: true,
            nested: {
                prop: E.A,
                nested: {
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