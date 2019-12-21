import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class StringVaildator extends BaseValidator<string> {
    private limitMin?: number
    private limitMax?: number
    private limitPattern?: RegExp

    validate(value: unknown) {
        if (typeof value !== 'string') {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
                receivedValue: value,
                receivedType: typeof value,
                expectedType: 'string',
            })
        }
        if (this.limitMin !== undefined && value.length < this.limitMin) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.MIN_LENGTH,
                constraintValue: this.limitMin,
                receivedValue: value,
            })
        }
        if (this.limitMax !== undefined && value.length > this.limitMax) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.MAX_LENGTH,
                constraintValue: this.limitMax,
                receivedValue: value,
            })
        }
        if (this.limitPattern !== undefined && !this.limitPattern.test(value)) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.PATTERN,
                constraintValue: this.limitPattern,
                receivedValue: value,
            })
        }
        return value
    }

    min(n: number) {
        this.limitMin = n
        return this
    }

    max(n: number) {
        this.limitMax = n
        return this
    }

    pattern(pattern: RegExp) {
        this.limitPattern = pattern
        return this
    }
}