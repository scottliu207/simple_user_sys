import moment from 'moment';

/**
 * 
 * @param ms - milliseconds
 * @returns 
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
}
/**
 * 
 * @param ms - milliseconds
 * @returns 
 */
export function GetDayStartAndEnd(current: Date): Day {
    const start = new Date(current)
    start.setUTCHours(0, 0, 0, 0)
    const end = new Date(current)
    end.setUTCHours(23, 59, 59, 0)
    return {
        startTime: start,
        endTime: end,
    }
}

export function getTimestamp(time: Date): number {
    const utcString = time.toUTCString();
    const utcDate = new Date(utcString);
    const timestamp = Math.floor(utcDate.getTime() / 1000);
    return timestamp
}