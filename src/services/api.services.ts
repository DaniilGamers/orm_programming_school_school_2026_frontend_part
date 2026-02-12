import axios from "axios";
import {baseURL, urls} from "../constants/urls";
import {IRes} from "../resType";
import {PageModel} from "../models/PageModel";
import {OrdersModel} from "../models/OrdersModel";
import {UserModel} from "../models/UserModel";
import {ActivateModel} from "../models/activateModel";
import {CommentModel} from "../models/commentModel";
import {StatusSumModel} from "../models/StatusSumModel";
import {useNavigate} from "react-router-dom";

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {}
})
axiosInstance.interceptors.request.use(request => {
    const token = localStorage.getItem('access')
    request.headers.set('Authorization', `Bearer ${token}`)
    return request
})

axiosInstance.interceptors.response.use(
     response => response,
     error => {
         if (error.response?.status === 401) {

             const navigate = useNavigate()

             localStorage.removeItem("access")
             localStorage.removeItem("refresh")
            navigate('/loginExpSession=true');
         }
         return Promise.reject(error);
     }
);

const ordersService = {
    getOrders:(filterLink: string):IRes<PageModel<OrdersModel>> => axiosInstance.get(urls.orders.getOrders(filterLink)),
    getGroups:() => axiosInstance.get(urls.orders.getGroups()),
    getExcel:(filteredLink: string) => axiosInstance.get(urls.orders.getExcel(filteredLink), {  responseType: "blob", withCredentials: true }),
    sendComment:(id: number, text: string) => axiosInstance.post(urls.orders.sendComment(id), { text }),
    getComments: (orderId: number): IRes<PageModel<CommentModel>> => axiosInstance.get(urls.orders.getComments(orderId)),
    getStatusOrdersCount: (manager?: string): IRes<StatusSumModel> => axiosInstance.get(urls.orders.getStatusOrdersCount(manager || '')),
    editOrder:(id: number, data: Record<string, any>) => axiosInstance.patch(urls.orders.editOrder(id) , data),
    addGroup:(name: string) => axiosInstance.post(urls.orders.addGroup(), {name}),
}

const usersService = {
    getManagers:():IRes<PageModel<UserModel>> => axiosInstance.get(urls.users.getManagers()),
    getManagerName:():IRes<UserModel> => axiosInstance.get(urls.users.getManagerName()),
    SetPassword:(token: string, password: string, confirm_password: string) => axiosInstance.post(urls.users.SetPassword(token), { password, confirm_password }),
    banManager:(id: number) => axiosInstance.patch(urls.users.BanManager(id)),
    unbanManager:(id: number) => axiosInstance.patch(urls.users.unbanManager(id)),
    activateManager:(id: number):IRes<ActivateModel> => axiosInstance.post(urls.users.activateManager(id)),
    createManager:(email: string, name: string, surname: string) => axiosInstance.post(urls.users.createManager(), {email,name,surname}),
}

const authService = {
    getAuth:(data: {email: string; password: string}) => axiosInstance.post(urls.auth.getAuth(), data),
    getRefresh:(data: {refresh: string}) => axiosInstance.post(urls.auth.getRefresh(), data)
}

export {
    ordersService,
    usersService,
    authService
}