const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
export function validatePassword(password: string): boolean {
    if (password.length < 8) {
        return false
    }
    
    return passwordPattern.test(password);
}