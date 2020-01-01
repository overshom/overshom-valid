export const HIDDEN_VALIDATOR_KEYS = {
    isRequired: '__isRequired',
    defaultValue: '__defaultValue',
} as const

export abstract class BaseValidator<T> {
    protected [HIDDEN_VALIDATOR_KEYS.isRequired] = true
    protected [HIDDEN_VALIDATOR_KEYS.defaultValue]: T | undefined

    abstract validate(value: unknown, ...rest: any[]): T

    optional(): Optional<this>
    optional(defaultValue: T): this
    optional(defaultValue?: T): this {
        this[HIDDEN_VALIDATOR_KEYS.isRequired] = false
        this[HIDDEN_VALIDATOR_KEYS.defaultValue] = defaultValue
        return this
    }
}

type Optional<T> = undefined | T

export type ExtractEnumValues<T> = T[keyof T]

export interface ObjectWithValidators {
    [key: string]: Optional<BaseValidator<any>>
}

export type ValueType<T> = T extends ObjectWithValidators
    ? ExtractObjectWithTypes<T>
    : ExtractValidatorType<T>

export type ExtractValidatorType<T> = T extends Optional<infer V>
    ? V extends BaseValidator<infer R> ? R : V
    : unknown

export type ExtractObjectWithTypes<T> = {
    [key in keyof T]: ExtractValidatorType<T[key]>
}

export enum CONSTRAINT_NAME {
    SOURCE_PARSE_FAIL = 'SOURCE_PARSE_FAIL',
    SOURCE_NOT_OBJECT = 'SOURCE_NOT_OBJECT',
    REQUIRED_KEY_MISSING = 'REQUIRED_KEY_MISSING',
    TYPE_MISMATCH = 'TYPE_MISMATCH',
    NO_VALIDATION_FOR_TYPE = 'NO_VALIDATION_FOR_TYPE',
    NOT_VALIDATOR_ERROR_INSTANCE = 'NOT_VALIDATOR_ERROR_INSTANCE',
    INVALID_VALIDATOR_PROVIDED = 'INVALID_VALIDATOR_PROVIDED',
    ACCUMULATIVE_ERROR = 'ACCUMULATIVE_ERROR',
    MIN_LENGTH = 'MIN_LENGTH',
    MAX_LENGTH = 'MAX_LENGTH',
    PATTERN = 'PATTERN',
    MIN_NUMBER = 'MIN_NUMBER',
    MAX_NUMBER = 'MAX_NUMBER',
    INVALID_ENUM_VALUE = 'INVALID_ENUM_VALUE',
    INVALID_BOOLEAN_VALUE = 'INVALID_BOOLEAN_VALUE',
    NOT_ARRAY_PROVIDED = 'NOT_ARRAY_PROVIDED',
}