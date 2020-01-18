import { ObjectWithValidators, ValueType, ExtractEnumValues, BaseValidator } from './types'
import { StringVaildator, NumberVaildator, EnumValidator, ObjectValidator, BooleanValidator, ArrayValidator, AllPropertiesValidator } from './validator'

export const v = {
    class: <T extends ObjectWithValidators, VT extends ValueType<T>>(schema: T): new (source: unknown) => VT => {
        return class {
            constructor(source: unknown) {
                const out = new ObjectValidator(schema).validate(source as T)
                Object.assign(this, out)
            }
        } as any
    },
    String: () => new StringVaildator(),
    Number: () => new NumberVaildator(),
    Boolean: () => new BooleanValidator(),
    Enum: <T>(e: T) => new EnumValidator(e) as any as EnumValidator<ExtractEnumValues<typeof e>>,
    Object: <T extends ObjectWithValidators>(e: T) => new ObjectValidator<T, ValueType<T>>(e),
    Array: <T extends any>(itemValidator: BaseValidator<T>) => new ArrayValidator(itemValidator),
    AllProperties: <T extends any>(propertyValidator: BaseValidator<T>) => new AllPropertiesValidator(propertyValidator),
    // TODO add withDecorator(decorator)
}