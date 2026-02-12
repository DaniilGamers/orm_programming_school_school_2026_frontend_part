const baseURL = 'http://127.0.0.1:8000/'

const urls = {
    orders: {
        getOrders: (filterLink: string): string => `/orders${filterLink}`,
        getGroups: (): string => `/orders/groups`,
        getExcel: (filterLink: string = ''): string => `/orders/export${filterLink}`,
        sendComment:(id: number): string => `/orders/${id}/comment/`,
        getComments:(order_id: number): string => `/orders/${order_id}/comment/`,
        getStatusOrdersCount:(manager?: string): string => `/orders/status_count${manager ? `?manager=${manager}/` : ''}`,
        editOrder:(id: number): string => `/orders/${id}/`,
        addGroup:() => `/orders/groups`,
    },
    users:{
        getManagers: (): string => `/users`,
        getManagerName: (): string => `/users/me/`,
        SetPassword: (token: string) => `/users/update_password/${token}`,
        BanManager: (id: number) => `/users/${id}/block/`,
        unbanManager: (id: number) => `/users/${id}/unblock/`,
        activateManager: (id: number) => `/users/${id}/activate/`,
        createManager: () => `/users`,
    },
    auth:{
        getAuth: (): string => `/auth/access`,
        getRefresh: (): string => `/auth/refresh`
    }
}

export {
    baseURL,
    urls
}