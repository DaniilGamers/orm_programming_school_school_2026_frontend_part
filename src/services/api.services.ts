import axios from "axios";
import {baseURL, urls} from "../constants/urls";
import {IRes} from "../resType";
import {OrdersPageModel} from "../models/OrdersPageModel";
import {OrdersModel} from "../models/OrdersModel";
import {UsersPageModel} from "../models/UsersPageModel";
import {UserModel} from "../models/UserModel";
import {GroupsPageModel} from "../models/GroupsPageModel";
import {GroupsModel} from "../models/GroupsModel";
import {ActivateModel} from "../models/activateModel";

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {}
})
axiosInstance.interceptors.request.use(request => {
    const token = localStorage.getItem('access')
    request.headers.set('Authorization', `Bearer ${token}`)
    return request
})

const ordersService = {
    getOrders:(filterLink: string):IRes<OrdersPageModel<OrdersModel>> => axiosInstance.get(urls.orders.getOrders(filterLink)),
    getGroups:():IRes<GroupsPageModel<GroupsModel>> => axiosInstance.get(urls.orders.getGroups())
}

const usersService = {
    getManagers:(filterLink: string):IRes<UsersPageModel<UserModel>> => axiosInstance.get(urls.users.getManagers(filterLink)),
    getManagerName:():IRes<UserModel> => axiosInstance.get(urls.users.getManagerName()),
    SetPassword:(token: string, password: string, confirm_password: string) => axiosInstance.post(urls.users.SetPassword(token), { password, confirm_password }),
    banManager:(id: number) => axiosInstance.patch(urls.users.BanManager(id)),
    unbanManager:(id: number) => axiosInstance.patch(urls.users.unbanManager(id)),
    activateManager:(id: number):IRes<ActivateModel> => axiosInstance.post(urls.users.activateManager(id)),
}

const authService = {
    getAuth:(data: {email: string; password: string}) => axiosInstance.post<{ link: string }>(urls.auth.getAuth(), data)
}

export {
    ordersService,
    usersService,
    authService
}