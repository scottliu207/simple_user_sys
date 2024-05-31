export type Paging = {
    limit: string;
    offset: string;
}

/**
 * 
 * @param page 
 * @param perPage 
 * @returns 
 */
export function paging(page: number, perPage: number): Paging {
    const res: Paging = {
        offset: ((page - 1) * perPage).toString(),
        limit: perPage.toString(),
    }
    return res
}