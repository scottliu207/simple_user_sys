const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
export function validatePassword(password: string): boolean {
    return passwordPattern.test(password);
}