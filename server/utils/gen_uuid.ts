import { v4 as uuidv4 } from 'uuid';


/**
 * Genarate a uuid
 * @returns {string} - uuid.
 */
export function genUUID(): string {
    return uuidv4()
}