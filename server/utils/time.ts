/**
 * Pauses execution for a specified amount of time.
 * @param ms - The number of milliseconds to wait.
 * @returns {Promise<void>}
 */
export async function timeout(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log(`Wait for ${ms} ms.`);
            resolve();
        }, ms);
    });
}

type Day = {
    startTime: Date;
    endTime: Date;
};

/**
 * Gets the start and end times of the current day.
 * @param current - The current date.
 * @returns {Day} - An object containing the start and end times.
 */
export function GetDayStartAndEnd(current: Date): Day {
    const start = new Date(current);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(current);
    end.setUTCHours(23, 59, 59, 999); // Changed 0 to 999 for milliseconds
    return {
        startTime: start,
        endTime: end,
    };
}

/**
 * Gets the timestamp of a given date.
 * @param time - The date to get the timestamp for.
 * @returns {number} - The timestamp in seconds.
 */
export function getTimestamp(time: Date): number {
    const utcString = time.toUTCString();
    const utcDate = new Date(utcString);
    const timestamp = Math.floor(utcDate.getTime() / 1000);
    return timestamp;
}
