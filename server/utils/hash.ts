import bcrypt from 'bcrypt'
import crypto from 'crypto'


const round = process.env.SALT_ROUND ? +process.env.SALT_ROUND : 10

/**
 * Hashes password
 * @param password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    try {
        const sha256hash = crypto.createHash('sha256').update(password).digest('hex')
        const salt = await bcrypt.genSalt(round)
        const bcryptHashed = bcrypt.hash(sha256hash, salt)
        return bcryptHashed
    } catch (error: unknown) {
        throw "hashing password failed, error: " + error
    }
}

/**
 * Verifies password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password
 * @returns {Promise<boolean>} - Where two string matches
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const sha256hash = crypto.createHash('sha256').update(password).digest('hex')
        const match = await bcrypt.compare(sha256hash, hashedPassword)
        return match
    } catch (error: unknown) {
        throw "comparing password failed, error: " + error
    }
}
