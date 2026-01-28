export interface OrdersPageModel<T> {

    count: number,
    next: string,
    previous: string,
    results: T[]

}