const baseURL = 'http://127.0.0.1:8000/'

const urls = {
    orders: {
        getOrders: (filterLink: string): string => `/orders${filterLink}`,
        getGroups: (): string => `/orders/view_groups`,
        getExcel:(): string => `/orders/export`,
        sendComment:(id: number): string => `/orders/send_comment/${id}/`,
        getComments:(order_id: number): string => `/orders/view_comments/${order_id}/`,
        getStatusOrdersCount:(manager?: string): string => `/orders/order_status_count${manager ? `?manager=${manager}` : ''}`,
        editOrder:(id: number): string => `/orders/edit_order/${id}/`,
        addGroup:() => `/orders/add_group`,
    },
    users:{
        getManagers: (filterLink: string): string => `/users/view_managerList${filterLink}`,
        getManagerName: (): string => `/users/checkUser`,
        SetPassword: (token: string) => `/users/set_password/${token}`,
        BanManager: (id: number) => `users/block_manager/${id}`,
        unbanManager: (id: number) => `users/unblock_manager/${id}`,
        activateManager: (id: number) => `users/activate_manager/${id}`,
        createManager: () => `users/create_manager`,
    },
    auth:{
        getAuth: (): string => `/auth/login`
    }
}

export {
    baseURL,
    urls
}