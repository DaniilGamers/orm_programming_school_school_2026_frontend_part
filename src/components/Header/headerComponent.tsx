import React, {useEffect} from 'react';
import css from './headerComponent.module.css'
import {useNavigate, useSearchParams} from "react-router-dom";
import adminIcon from '../../assets/admin.c305133bad8700df7d8be698c350c2bb.svg'
import logOutIcon from '../../assets/logOut.7e73deefd22b4062b49d7ed47c46a9e1.svg'
import {useAppDispatch, useAppSelector} from "../../redux/store/store";
import {userActions} from "../../redux/slices/userSlicer";
import {authActions} from "../../redux/slices/authSlicer";


const HeaderComponent = () => {

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const {user} = useAppSelector((state) => state.user)

    const loading = useAppSelector(state => state.user.loading)

    const [query] = useSearchParams()

    const filterString = '?' + query.toString();

    useEffect(() => {
        dispatch(userActions.getManagerName())
    }, [dispatch]);

    useEffect(() => {

        if(!localStorage.getItem("access"))
        {
            const token = String(localStorage.getItem("refresh"))
            dispatch(authActions.refresh({ refresh: token }))

        }

    }, [navigate,dispatch, filterString]);

    function logOut() {

        localStorage.removeItem("access")
        localStorage.removeItem("refresh")

        navigate('/login')

    }

    return (
        <div>
            <header className={css.headerBox}>

                    <div className={css.figureBox}>

                        <h2 onClick={() => {navigate('/orders?page=1')}}>Logo</h2>

                        <button onClick={() => {navigate('/orders?page=1')}}>ORDERS</button>

                    </div>

                    <div className={css.navMenuBox}>

                        <p className={css.nameDisplayHeader}>{loading && user && user.name}</p>

                        {loading && user?.is_superuser && <button className={css.adminBtn} onClick={() => {navigate('/adminPanel')}}><img className={css.adminIcon} src={adminIcon} alt={"adminPanel"} /></button>}
                        <button className={css.logOutBtn} onClick={logOut}><img className={css.logOutIcon} src={logOutIcon} alt={"logOut"} /></button>


                    </div>

            </header>
        </div>
    );
};

export default HeaderComponent;