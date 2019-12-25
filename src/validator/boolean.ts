import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class BooleanValidator extends BaseValidator<boolean> {
    private readonly expectedType = 'boolean'

    validate(value: unknown) {
        const bool = this.coerce(value)
        return bool
    }

    private coerce(receivedValue: unknown): boolean {
        if (typeof receivedValue === 'string') {
            switch (receivedValue) {
                case 'true':
                    return true
                case 'false':
                    return false
                case '1':
                    return true
                case '0':
                    return false
                default:
                    throw new ValidationError({
                        constraintName: CONSTRAINT_NAME.INVALID_BOOLEAN_VALUE,
                        receivedValue,
                        expectedType: this.expectedType,
                        receivedType: typeof receivedValue,
                    })
            }
        }
        if (typeof receivedValue === 'number') {
            switch (receivedValue) {
                case 1:
                    return true
                case 0:
                    return false
                default:
                    throw new ValidationError({
                        constraintName: CONSTRAINT_NAME.INVALID_BOOLEAN_VALUE,
                        receivedValue,
                        expectedType: this.expectedType,
                        receivedType: typeof receivedValue,
                    })
            }
        }
        if (typeof receivedValue !== 'boolean') {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.INVALID_BOOLEAN_VALUE,
                receivedValue,
                expectedType: this.expectedType,
                receivedType: typeof receivedValue,
            })
        }
        return receivedValue
    }
}