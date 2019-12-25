import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class StringVaildator extends BaseValidator<string> {
    private readonly expectedType = 'number'
    private limitMin?: number
    private limitMax?: number
    private limitPattern?: RegExp

    validate(value: unknown) {
        const string = this.coerce(value)
        this.checkRestrictions(string, value)
        return string
    }

    private coerce(receivedValue: unknown): string {
        if (typeof receivedValue === 'number' || typeof receivedValue === 'boolean') {
            return String(receivedValue)
        }
        if (typeof receivedValue !== 'string') {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
                receivedValue,
                receivedType: typeof receivedValue,
                expectedType: this.expectedType,
            })
        }
        return receivedValue
    }

    private checkRestrictions(string: string, receivedValue: unknown) {
        if (this.limitMin !== undefined && string.length < this.limitMin) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.MIN_LENGTH,
                constraintValue: this.limitMin,
                receivedValue,
            })
        }
        if (this.limitMax !== undefined && string.length > this.limitMax) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.MAX_LENGTH,
                constraintValue: this.limitMax,
                receivedValue,
            })
        }
        if (this.limitPattern !== undefined && !this.limitPattern.test(string)) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.PATTERN,
                constraintValue: this.limitPattern,
                receivedValue,
            })
        }
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