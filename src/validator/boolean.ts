import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class BooleanValidator extends BaseValidator<boolean> {
    validate(value: unknown) {
        if (typeof value !== 'boolean') {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.INVALID_BOOLEAN_VALUE,
                receivedValue: value,
                expectedType: 'boolean',
                receivedType: typeof value,
            })
        }
        return value
    }
}