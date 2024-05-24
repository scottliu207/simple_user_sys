import jwt, { SignOptions } from 'jsonwebtoken'

const option: SignOptions = {
    expiresIn: process.env.JWT_EXPIRE,
}

/**
 * Generates JWT token
 * @param userId 
 * @returns {string} - JWT Token 
 */
export async function genShortToken(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { userId },
            process.env.JWT_SECRET!,
            option,
            (err, token) => {
                if (err) {
                    reject(err)
                }

                if (!token) {
                    reject(new Error('Token generation failed'))
                }

                resolve(token!)
            }
        )
    })
}

//  todo: refresh token




