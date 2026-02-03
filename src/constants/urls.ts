const baseURL = 'http://127.0.0.1:8000/'

const urls = {
    orders: {
        getOrders: (filterLink: string): string => `/orders/list_orders${filterLink}`,
        getGroups: (): string => `/orders/list_groups/`,
        getExcel: (filterLink: string = ''): string => `/orders/excel_export${filterLink}`,
        sendComment:(id: number): string => `/orders/post_comment/${id}/`,
        getComments:(order_id: number): string => `/orders/list_comments/${order_id}/`,
        getStatusOrdersCount:(manager?: string): string => `/orders/count_order_status${manager ? `?manager=${manager}/` : ''}`,
        editOrder:(id: number): string => `/orders/update_order/${id}/`,
        addGroup:() => `/orders/create_group/`,
    },
    users:{
        getManagers: (): string => `/users/list_managers/`,
        getManagerName: (): string => `/users/get_user/`,
        SetPassword: (token: string) => `/users/update_password/${token}`,
        BanManager: (id: number) => `users/block_manager/${id}/`,
        unbanManager: (id: number) => `users/unblock_manager/${id}/`,
        activateManager: (id: number) => `users/post_activate_manager/${id}/`,
        createManager: () => `users/create_manager/`,
    },
    auth:{
        getAuth: (): string => `/auth/access`
    }
}

export {
    baseURL,
    urls
}