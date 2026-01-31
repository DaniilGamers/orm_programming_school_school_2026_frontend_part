import React from 'react';
import HeaderComponent from "../components/Header/headerComponent";
import FooterComponent from "../components/Footer/footerComponent";
import {Outlet} from "react-router-dom";
import CreateManagerComponent from "../components/adminPanel/createManager/createManagerComponent";
import {CreateMenuProvider} from "../redux/context/CreateMenuContext";
import EditOrderComponent from "../components/orders/editOrder/editOrderComponent";

const MainPage = () => {
    return (
        <div><CreateMenuProvider>

                <EditOrderComponent/>

                <CreateManagerComponent/>

                <HeaderComponent/>

                    <Outlet/>

                <FooterComponent/>
        </CreateMenuProvider>
        </div>
    );
};

export default MainPage;