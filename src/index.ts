import { ObjectWithValidators, ValueType, ExtractEnumValues, CONSTRAINT_NAME } from './types'
import { StringVaildator, NumberVaildator, EnumValidator, NestedValidator, BooleanValidator } from './validator'
import { ValidationError } from './error'

export const v = {
    class: <T extends ObjectWithValidators, VT extends ValueType<T>>(schema: T): new (source: unknown) => VT => {
        return class {
            constructor(source: unknown) {
                if (typeof source === 'string') {
                    try {
                        source = JSON.parse(source)
                    } catch (e) {
                        throw new ValidationError({
                            constraintName: CONSTRAINT_NAME.SOURCE_PARSE_FAIL,
                            caughtError: e,
                        })
                    }
                }

                const nested = new NestedValidator(schema)
                const out = nested.validate(source as T)
                const { validationErrors } = nested

                if (validationErrors.length) {
                    console.error('VALIDATION ERRORS', {
                        source,
                        validationErrors,
                    })
                    throw new ValidationError({
                        constraintName: CONSTRAINT_NAME.FAILED_TO_CONSTRUCT,
                    })
                }

                Object.assign(this, out)
            }
        } as any
    },
    String: () => new StringVaildator(),
    Number: () => new NumberVaildator(),
    Boolean: () => new BooleanValidator(),
    Enum: <T>(e: T) => new EnumValidator(e) as any as EnumValidator<ExtractEnumValues<typeof e>>,
    Nested: <T extends ObjectWithValidators>(e: T) => new NestedValidator<T, ValueType<T>>(e),
    // TODO add withDecorator(decorator)
}