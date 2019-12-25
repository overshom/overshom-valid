import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class NumberVaildator extends BaseValidator<number> {
    private readonly expectedType = 'number'
    private limitMin?: number
    private limitMax?: number

    validate(value: unknown) {
        const number = this.coerce(value)
        this.checkRestrictions(number, value)
        return number
    }

    private coerce(receivedValue: unknown): number {
        const number = Number(receivedValue)
        if (Number.isNaN(number)) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
                receivedValue,
                expectedType: this.expectedType,
                receivedType: typeof receivedValue,
            })
        }
        if (false === Number.isFinite(number)) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.TYPE_MISMATCH,
                receivedValue,
                expectedType: this.expectedType,
                receivedType: typeof receivedValue,
            })
        }
        return number
    }

    private checkRestrictions(number: number, receivedValue: unknown) {
        if (this.limitMin !== undefined && number < this.limitMin) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.MIN_NUMBER,
                constraintValue: this.limitMin,
                receivedValue,
            })
        }
        if (this.limitMax !== undefined && number > this.limitMax) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.MAX_NUMBER,
                constraintValue: this.limitMax,
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
}