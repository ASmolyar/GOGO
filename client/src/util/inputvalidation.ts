/**
 * Email validation regex pattern
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Input error messages
 */
export enum InputErrorMessage {
    MISSING_INPUT = 'This field is required',
    INVALID_EMAIL = 'Please enter a valid email address',
    PASSWORD_TOO_SHORT = 'Password must be at least 8 characters',
    PASSWORDS_DONT_MATCH = 'Passwords do not match',
}

