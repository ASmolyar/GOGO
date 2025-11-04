const DEFAULT_BACKEND_URL = 'http://localhost:4000';

const API_BASE_URL =
    (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? DEFAULT_BACKEND_URL;

export interface User {
    email: string;
    firstName?: string;
    lastName?: string;
    admin: boolean;
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    return response.json();
}

/**
 * Logout current user
 */
export async function logout(): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    return response.ok;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    } catch (error) {
        return null;
    }
}

