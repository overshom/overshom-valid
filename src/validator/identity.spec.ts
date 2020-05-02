import { v } from '..'

describe('identity', () => {
    it('base validation', () => {
        const someValue = 'string'
        const rest = ['v', 5]
        const validated = v.Identity().validate([someValue, ...rest])

        expect(validated).toEqual([someValue, ...rest])

        const reference = {}
        expect(reference).toBe(reference)
    })

    it('as any validation', () => {
        const someValue = 'string'
        const validated = v.Identity().asAny().validate(someValue)

        let lackOfTypesafety = false
        try {
            validated.non.existing.property = 1
        } catch {
            lackOfTypesafety = true
        }

        expect(validated).toEqual(someValue)
        expect(lackOfTypesafety).toBe(true)
    })
})