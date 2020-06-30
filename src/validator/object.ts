import { BaseValidator, ObjectWithValidators, ValueType, HIDDEN_VALIDATOR_KEYS, CONSTRAINT_NAME } from '../types'
import { ValidationError, ErrorDetails } from '../error'
import { logger } from '../logger'

const findValidatorTransformFn = (validator: BaseValidator<any>) => {
    const transformFn = (validator as any)[HIDDEN_VALIDATOR_KEYS.transformFn]
    if (!transformFn) {
        return
    }
    return transformFn as (value: any) => any
}

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

            let writeValue: any = undefined
            if (key in objSource) {
                writeValue = objSource[key]
            }
            if (HIDDEN_VALIDATOR_KEYS.defaultValue in validator) {
                if (writeValue === null || writeValue === undefined) {
                    writeValue = (validator as any)[HIDDEN_VALIDATOR_KEYS.defaultValue]
                }
            }
            if ((validator as any)[HIDDEN_VALIDATOR_KEYS.isRequired]) {
                if (writeValue === null || writeValue === undefined) {
                    return pushError({
                        constraintName: CONSTRAINT_NAME.REQUIRED_KEY_MISSING,
                    })
                }
            }
            if (writeValue === undefined || writeValue === null) {
                return
            }
            try {
                const transformFn = findValidatorTransformFn(validator)
                if (validator instanceof ObjectValidator) {
                    try {
                        const value = validator.validate(writeValue, currentKeyPath)
                        out[key] = transformFn ? transformFn(value) : value
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
                const value = validator.validate(writeValue)
                out[key] = transformFn ? transformFn(value) : value
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
                logger.error('VALIDATION ERRORS', {
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