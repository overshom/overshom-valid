export const HIDDEN_VALIDATOR_KEYS = {
    isRequired: '__isRequired',
    defaultValue: '__defaultValue',
} as const

export abstract class BaseValidator<T> {
    protected [HIDDEN_VALIDATOR_KEYS.isRequired] = true
    protected [HIDDEN_VALIDATOR_KEYS.defaultValue]: T | undefined

    abstract validate(value: unknown, ...rest: any[]): T

    optional(defaultValue?: T): Optional<this> {
        this[HIDDEN_VALIDATOR_KEYS.isRequired] = false
        this[HIDDEN_VALIDATOR_KEYS.defaultValue] = defaultValue
        return this
    }
}

type Optional<T> = void | T

export type ExtractEnumValues<T> = T[keyof T]

export interface ObjectWithValidators {
    [key: string]: BaseValidator<any> | void
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
    FAILED_TO_CONSTRUCT = 'FAILED_TO_CONSTRUCT',
    MIN_LENGTH = 'MIN_LENGTH',
    MAX_LENGTH = 'MAX_LENGTH',
    PATTERN = 'PATTERN',
    MIN_NUMBER = 'MIN_NUMBER',
    MAX_NUMBER = 'MAX_NUMBER',
    INVALID_ENUM_VALUE = 'INVALID_ENUM_VALUE',
    INVALID_BOOLEAN_VALUE = 'INVALID_BOOLEAN_VALUE',
    NULL_VALUE_FORBIDDEN = 'NULL_VALUE_FORBIDDEN',
    NOT_ARRAY_PROVIDED = 'NOT_ARRAY_PROVIDED',
}