import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class NumberVaildator extends BaseValidator<number> {
    private limitMin?: number
    private limitMax?: number

    validate(value: unknown) {
        if (typeof value !== 'number') {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
                receivedValue: value,
                expectedType: 'number',
                receivedType: typeof value,
            })
        }
        if (this.limitMin !== undefined && value < this.limitMin) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.MIN_NUMBER,
                constraintValue: this.limitMin,
                receivedValue: value,
            })
        }
        if (this.limitMax !== undefined && value > this.limitMax) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.MAX_NUMBER,
                constraintValue: this.limitMax,
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
}