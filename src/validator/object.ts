import { BaseValidator, ObjectWithValidators, ValueType, HIDDEN_VALIDATOR_KEYS, CONSTRAINT_NAME } from '../types';
import { ValidationError } from '../error';

export class ObjectValidator<T extends ObjectWithValidators, VT extends ValueType<T>> extends BaseValidator<VT> {
    constructor(private schema: T) {
        super()
    }

    validationErrors: ValidationError['details'][] = []

    validate(source: { [key: string]: any }, parentKeyPath = '') {
        const { validationErrors } = this
        validationErrors.length = 0

        if (typeof source !== 'object') {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.SOURCE_NOT_OBJECT,
                key: parentKeyPath,
            })
        }

        const out = {} as any
        const { schema } = this

        Object.keys(schema).forEach(key => {
            const accumulateError = (details: ValidationError['details']) => {
                const error = new ValidationError({
                    key: currentKeyPath,
                    ...details,
                })
                validationErrors.push(error.details)
            }
            const currentKeyPath = parentKeyPath === '' ? key : `${parentKeyPath}.${key}`

            const validator = schema[key]
            if (!(validator instanceof BaseValidator)) {
                return accumulateError({
                    constraintName: CONSTRAINT_NAME.INVALID_VALIDATOR_PROVIDED,
                })
            }

            let writeValue: any
            if (key in source) {
                writeValue = source[key]
            } else {
                if ((validator as any)[HIDDEN_VALIDATOR_KEYS.isRequired]) {
                    return accumulateError({
                        constraintName: CONSTRAINT_NAME.REQUIRED_KEY_MISSING,
                    })
                }
                writeValue = (validator as any)[HIDDEN_VALIDATOR_KEYS.defaultValue]
                if (writeValue === undefined) {
                    return
                }
            }
            if (writeValue === null) {
                return accumulateError({
                    constraintName: CONSTRAINT_NAME.NULL_VALUE_FORBIDDEN,
                })
            }
            try {
                if (validator instanceof ObjectValidator) {
                    const nested = validator.validate(writeValue, currentKeyPath)
                    if (validator.validationErrors.length) {
                        validationErrors.push(...validator.validationErrors)
                        return
                    }
                    out[key] = nested
                    return
                }
                out[key] = validator.validate(writeValue)
            } catch (e) {
                if (!(e instanceof ValidationError)) {
                    return accumulateError({
                        constraintName: CONSTRAINT_NAME.NOT_VALIDATOR_ERROR_INSTANCE,
                    })
                }
                return accumulateError({
                    ...e.details,
                    key: currentKeyPath,
                })
            }
        })
        return out as VT
    }
}