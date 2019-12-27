import { BaseValidator, ObjectWithValidators, ValueType, HIDDEN_VALIDATOR_KEYS, CONSTRAINT_NAME } from '../types'
import { ValidationError, ErrorDetails } from '../error'

export class ObjectValidator<T extends ObjectWithValidators, VT extends ValueType<T>> extends BaseValidator<VT> {
    constructor(private schema: T) {
        super()
    }

    validate(source: unknown, parentKeyPath = '') {
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

        const accumulativeDetails: ErrorDetails[] = []

        if (typeof source !== 'object') {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.SOURCE_NOT_OBJECT,
                key: parentKeyPath,
            })
        }

        const objSource = source as { [key: string]: any }

        const out = {} as any
        const { schema } = this

        Object.keys(schema).forEach(key => {
            const pushError = (details: ValidationError['details']) => {
                const error = new ValidationError({
                    key: currentKeyPath,
                    ...details,
                })
                accumulativeDetails.push(error.details)
            }
            const currentKeyPath = parentKeyPath === '' ? key : `${parentKeyPath}.${key}`

            const validator = schema[key]
            if (!(validator instanceof BaseValidator)) {
                return pushError({
                    constraintName: CONSTRAINT_NAME.INVALID_VALIDATOR_PROVIDED,
                })
            }

            let writeValue: any
            if (key in objSource) {
                writeValue = objSource[key]
            } else {
                if ((validator as any)[HIDDEN_VALIDATOR_KEYS.isRequired]) {
                    return pushError({
                        constraintName: CONSTRAINT_NAME.REQUIRED_KEY_MISSING,
                    })
                }
                writeValue = (validator as any)[HIDDEN_VALIDATOR_KEYS.defaultValue]
                if (writeValue === undefined) {
                    return
                }
            }
            if (writeValue === null) {
                return
            }
            try {
                if (validator instanceof ObjectValidator) {
                    try {
                        out[key] = validator.validate(writeValue, currentKeyPath)
                    } catch (e) {
                        if (!(e instanceof ValidationError)) {
                            throw e
                        }
                        if (!e.details.accumulativeDetails) {
                            throw e
                        }
                        accumulativeDetails.push(...e.details.accumulativeDetails)
                        return
                    }
                    return
                }
                out[key] = validator.validate(writeValue)
            } catch (e) {
                if (!(e instanceof ValidationError)) {
                    return pushError({
                        constraintName: CONSTRAINT_NAME.NOT_VALIDATOR_ERROR_INSTANCE,
                    })
                }
                return pushError({
                    ...e.details,
                    key: currentKeyPath,
                })
            }
        })

        if (accumulativeDetails.length) {
            if (parentKeyPath === '') {
                // TODO use better approach than just console. Add ability to disable / intercept logs.
                console.error('VALIDATION ERRORS', {
                    source,
                    accumulativeDetails,
                })
            }
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.ACCUMULATIVE_ERROR,
                accumulativeDetails,
            })
        }

        return out as VT
    }
}