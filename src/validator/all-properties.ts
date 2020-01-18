import { BaseValidator, CONSTRAINT_NAME, ExtractValidatorType } from '../types'
import { ValidationError } from '../error'

export class AllPropertiesValidator<PV extends BaseValidator<any>, T = ExtractValidatorType<PV>> extends BaseValidator<{
    [key: string]: T
}> {
    constructor(private propertyValidator: PV) {
        super()
        if (false === propertyValidator instanceof BaseValidator) {
            throw new Error('Not base validator provided to AllPropertiesValidator')
        }
    }

    validate(value: unknown) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value)
            } catch (e) {
                throw new ValidationError({
                    constraintName: CONSTRAINT_NAME.SOURCE_PARSE_FAIL,
                    caughtError: e,
                })
            }
        }
        if (typeof value !== 'object' || value === null) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
                receivedValue: value,
                receivedType: typeof value,
                expectedType: 'object',
            })
        }
        Object.values(value).forEach(v => this.propertyValidator.validate(v))
        return value as { [key: string]: T }
    }
}