export function validateName(name: string): string {
    const value = name.trim();

    if (!value) {
        return "Full name is required";
    }

    if (value.length < 3 || value.length > 50) {
        return "Name must be between 3 and 50 characters";
    }

    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value)) {
        return "Use letters only, with single spaces between names";
    }

    return "";
}

export function validateEmail(email: string): string {
    const value = email.trim();

    if (!value) {
        return "Email is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Enter a valid email address";
    }

    return "";
}

export function validatePassword(password: string): string {
    if (!password) {
        return "Password is required";
    }

    if (/\s/.test(password)) {
        return "Password cannot contain whitespace";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters";
    }

    return "";
}
