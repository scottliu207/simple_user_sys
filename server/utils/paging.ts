export type Paging = {
    limit: number;
    offset: number;
}

/**
 * 
 * @param page 
 * @param perPage 
 * @returns 
 */
export function paging(page: number, perPage: number): Paging {
    const res: Paging = {
        offset: (page - 1) * perPage,
        limit: perPage,
    }
    return res
}