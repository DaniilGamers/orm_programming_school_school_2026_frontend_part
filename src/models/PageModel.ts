export interface PageModel<T> {

    count: number,
    next: string,
    previous: string,
    results: T[]

}