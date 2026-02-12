import {createBrowserRouter, RouteObject} from "react-router-dom";
import LoginPage from "../pages/loginPage";
import AdminPanelPage from "../pages/adminPanelPage";
import OrdersPage from "../pages/ordersPage";
import ActivatePage from "../pages/activatePage";
import MainPage from "../pages/mainPage";
import App from "../App";


const routes: RouteObject[] = [
    {
        path: '',
        errorElement: <h2>It seems something went wrong</h2>,
        children: [
            {index: true, element: <App/>},
            {path: 'login', element: <LoginPage/>},
            {path: 'loginExpSession=true', element: <LoginPage/>},
            {path: 'activate/:token', element: <ActivatePage/>},
            {path: '', element: <MainPage/>,
            children: [
                {path: '/orders', element: <OrdersPage/>},
                {path: '/adminPanel', element: <AdminPanelPage/>}
            ]},

        ]
    }
]

export const router = createBrowserRouter(routes)