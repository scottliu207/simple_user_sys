import jwt, { SignOptions } from 'jsonwebtoken'
import { genUuid } from './gen_uuid'



interface JwtPayload {
    userId: string;
    tokenId?: string;
}

export interface RefreshToken {
    tokenId: string;
    userId: string;
    token: string;
}

/**
 * 
 * @param userId 
 * @returns 
 */
export async function genAccessToken(userId: string): Promise<string> {
    try {
        const payload: JwtPayload = {
            userId: userId,
        }
        const token = await genToken(payload, process.env.JWT_ACCESS_TOKEN_EXPIRE!)
        return token
    } catch (error: unknown) {
        throw error
    }
}

/**
 * 
 * @returns 
 */
export async function genRefreshToken(userId: string): Promise<RefreshToken> {
    try {
        const tokenId = genUuid()
        const payload: JwtPayload = {
            userId: userId,
            tokenId: tokenId,
        }

        const token = await genToken(payload, process.env.JWT_REFRESH_TOKEN_EXPIRE!)
        const base64Encoded = Buffer.from(token).toString('base64');


        const refreshToken: RefreshToken = {
            userId: userId,
            tokenId: tokenId,
            token: base64Encoded,
        }

        return refreshToken
    } catch (error: unknown) {
        throw error
    }
}

/**
 * 
 * @param token 
 * @returns 
 */
export async function validateAccessToken(token: string): Promise<JwtPayload> {
    try {
        const payload: JwtPayload = await validateToken(token)
        return payload
    } catch (error: unknown) {
        throw error
    }
};

/**
 * 
 * @param token 
 * @returns 
 */
export async function validateRefreshToken(token: string): Promise<JwtPayload> {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8')
        if (!decoded) {
            throw new Error('Refresh token validation failed.')
        }
        const payload: JwtPayload = await validateToken(decoded)
        return payload
    } catch (error: unknown) {
        throw error
    }
};



/**
 * Generates JWT token
 * @param userId 
 * @returns {string} - JWT Token 
 */
async function genToken(payload: JwtPayload, expire: string): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET!,
            { expiresIn: expire } as SignOptions,
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

/**
 * 
 * @param token 
 * @returns 
 */
export async function validateToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};




