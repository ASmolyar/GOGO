import { getDatabase } from '../config/database.js';
import bcrypt from 'bcrypt';

export interface User {
    email: string;
    password: string;
    autopromote: boolean;
    firstName?: string;
    lastName?: string;
}

export interface UserDocument extends User {
    _id?: unknown;
}

/**
 * Find a user by email address
 */
export async function findUserByEmail(email: string): Promise<UserDocument | null> {
    const db = await getDatabase();
    const user = await db.collection<UserDocument>('users').findOne({ email });
    return user;
}

/**
 * Verify a plain text password against a hashed password
 */
export async function verifyPassword(
    plainPassword: string,
    hashedPassword: string,
): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}

