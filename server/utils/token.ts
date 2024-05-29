import jwt, { JwtPayload } from 'jsonwebtoken'

/**
 * 
 * @param userId - User's id
 * @returns {sessionId} - SessionId
 */
export function generateSessionId(userId: string): string {
    const payload: JwtPayload = {
        userId: userId,
    }
    const token = jwt.sign(payload, process.env.SESSION_SECRET!)
    return token
}


/**
 * 
 * @param sessionId -  User's sessionId 
 * @returns {redisKey} - User's session key stored on redis/
 */
export function verifySessionId(sessionId: string): string {
    const payload = jwt.verify(sessionId, process.env.SESSION_SECRET!) as JwtPayload
    return payload.userId
};


/**
 * 
 * @param userId 
 * @returns -
 */
export function genEmailToken(userId: string): string {
    const payload: JwtPayload = {
        userId: userId,
    }

    return jwt.sign(payload, process.env.JWT_SECRET!)
}

/**
 * 
 * @param token 
 * @returns 
 */
export function verifyEmailToken(token: string): string {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    return payload.userId
};







