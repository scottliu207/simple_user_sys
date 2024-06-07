export type Paging = {
    limit: string;
    offset: string;
};

/**
 * Generates pagination parameters.
 * @param page - The current page number.
 * @param perPage - The number of items per page.
 * @returns {Paging} - The pagination parameters.
 */
export function paging(page: number, perPage: number): Paging {
    const res: Paging = {
        offset: ((page - 1) * perPage).toString(),
        limit: perPage.toString(),
    };
    return res;
}
