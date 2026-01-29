import React from 'react';
import HeaderComponent from "../components/Header/headerComponent";
import FooterComponent from "../components/Footer/footerComponent";
import {Outlet} from "react-router-dom";
import CreateManagerComponent from "../components/adminPanel/createManager/createManagerComponent";
import {CreateMenuProvider} from "../redux/context/CreateMenuContext";

const MainPage = () => {
    return (
        <div><CreateMenuProvider>
                <CreateManagerComponent/>

                <HeaderComponent/>

                    <Outlet/>

                <FooterComponent/>
        </CreateMenuProvider>
        </div>
    );
};

export default MainPage;