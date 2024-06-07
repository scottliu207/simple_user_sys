import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a UUID.
 * @returns {string} - The generated UUID.
 */
export function genUuid(): string {
    return uuidv4();
}
