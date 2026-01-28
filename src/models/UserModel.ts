export interface UserModel {
    id: number,
    email: string,
    name: string,
    surname: string,
    is_active: boolean,
    is_superuser: boolean,
    last_login_display: string
}