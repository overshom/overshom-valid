import { BaseValidator, CONSTRAINT_NAME } from '../types'
import { ValidationError } from '../error'

const stringifyEnumValues = (e: any) => {
    const keys = Object.keys(e).filter(k => Number.isNaN(+k))
    const values = keys.map(k => typeof e[k] === 'string' ? `"${e[k]}"` : e[k]).join(' | ')
    return `Enum( ${values} )`
}

export class EnumValidator<T> extends BaseValidator<T> {
    constructor(private e: T) {
        super()
        if (typeof e !== 'object') {
            throw new Error('Not enum provided to EnumValidator')
        }
    }

    validate(value: unknown) {
        if (false === Object.values(this.e).some(option => value === option)) {
            throw new ValidationError({
                constraintName: CONSTRAINT_NAME.INVALID_ENUM_VALUE,
                receivedValue: value,
                expectedType: stringifyEnumValues(this.e),
            })
        }
        return value as T
    }
}