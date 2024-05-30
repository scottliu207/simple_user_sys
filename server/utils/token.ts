import { randomBytes } from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { genUuid } from './gen_uuid'

/**
 * 
 * @param userId - User's id
 * @returns {sessionId} - SessionId
 */
export function generateJwtToken(userId: string): string {
    const payload: JwtPayload = {
        userId: userId,
        aud: process.env.JWT_AUDIENCE!,
        iss: process.env.JWT_ISSUER!,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET!)
    return token
}


/**
 * 
 * @param token -  User's sessionId 
 * @returns {redisKey} - User's session key stored on redis/
 */
export function verifyJwtToken(token: string): string {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    return payload.userId
};

/**
 * 
 * @param token -  User's sessionId 
 * @returns {token} - User's session key stored on redis/
 */

export function generateToken(): string {
    return Buffer.from(genUuid()).toString('base64')
};