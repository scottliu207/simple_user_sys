const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

/**
 * Validates a password.
 * @param password - The password to validate.
 * @returns {boolean} - Whether the password is valid.
 */
export function validatePassword(password: string): boolean {
    if (password.length < 8) {
        return false;
    }

    return passwordPattern.test(password);
}
