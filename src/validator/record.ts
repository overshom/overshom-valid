import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class RecordValidator<SemanticValue, PV extends BaseValidator<SemanticValue> = BaseValidator<SemanticValue>> extends BaseValidator<Record<string, SemanticValue>> {
    constructor(private propertyValidator: PV) {
        super()
        if (false === propertyValidator instanceof BaseValidator) {
            throw new Error('Not validator provided to RecordValidator')
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
                constraintName: CONSTRAINT_NAME.SOURCE_NOT_OBJECT,
                receivedValue: value,
                receivedType: typeof value,
                expectedType: 'object',
            })
        }
        Object.values(value).forEach(v => this.propertyValidator.validate(v))
        return value as Record<string, SemanticValue>
    }
}