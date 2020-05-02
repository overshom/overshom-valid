import { BaseValidator } from '../types'

/**
 * Returns exactly the same value received for validation
 * including object reference
 */
export class IdentityValidator extends BaseValidator<unknown> {
    validate(value: unknown) {
        return value
    }

    /**
     * Avoid using this method as it causes lack of typesefety
     */
    asAny() {
        return this as BaseValidator<any>
    }
}