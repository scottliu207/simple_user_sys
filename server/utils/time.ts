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