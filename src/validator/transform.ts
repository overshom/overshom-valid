import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class TransformValidator<T> extends BaseValidator<T> {
    constructor(private transformFn: (value: unknown) => T) {
        super()
    }

    validate(value: unknown) {
        try {
            return this.transformFn(value)
        } catch (e) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.TRANSFORMATION_ERROR,
                caughtError: e,
            })
        }
    }
}