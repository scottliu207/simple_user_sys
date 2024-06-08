import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { genUuid } from './gen_uuid';

/**
 * Generates a JWT token.
 * @param userId - User's ID.
 * @returns {string} - JWT token.
 */
export function generateJwtToken(userId: string): string {
    const payload: JwtPayload = {
        userId: userId,
        aud: process.env.JWT_AUDIENCE!,
        iss: process.env.JWT_ISSUER!,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);
    return token;
}

/**
 * Verifies a JWT token.
 * @param token - User's session ID.
 * @returns {string} - User's ID.
 */
export function verifyJwtToken(token: string): string | null {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        return payload.userId;
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return null
        }
        throw new Error(`Failed to verify JwtToken, ${error}`)
    }
}

/**
 * Generates a token.
 * @returns {string} - A base64 encoded token.
 */
export function generateToken(): string {
    return Buffer.from(genUuid()).toString('base64');
}
