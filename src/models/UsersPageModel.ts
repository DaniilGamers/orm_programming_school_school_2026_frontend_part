export interface UsersPageModel<T> {

    count: number,
    next: string,
    previous: string,
    results: T[]

}