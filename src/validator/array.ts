import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

export class ArrayValidator<T> extends BaseValidator<T[]> {
    constructor(private itemValidator: BaseValidator<T>) {
        super()
    }

    validate(value: unknown) {
        if (!Array.isArray(value)) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.NOT_ARRAY_PROVIDED,
            })
        }
        const result = value.map(item => this.itemValidator.validate(item))
        return result
    }
}