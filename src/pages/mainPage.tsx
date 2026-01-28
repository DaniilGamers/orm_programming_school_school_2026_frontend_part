import React from 'react';
import HeaderComponent from "../components/Header/headerComponent";
import FooterComponent from "../components/Footer/footerComponent";
import {Outlet} from "react-router-dom";

const MainPage = () => {
    return (
        <div>

            <HeaderComponent/>

                <Outlet/>

            <FooterComponent/>
        </div>
    );
};

export default MainPage;