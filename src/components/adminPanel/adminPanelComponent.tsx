import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store/store";
import {useSearchParams} from "react-router-dom";
import {userActions} from "../../redux/slices/userSlicer";
import css from "./adminPanel.module.css"
import {useCreateMenu} from "../../redux/context/CreateMenuContext";
import {orderActions} from "../../redux/slices/orderSlicer";

const AdminPanelComponent = () => {

    const dispatch = useAppDispatch()

    // loading = useAppSelector((state) => state.order.loading)

    const { openMenu } = useCreateMenu()

    const {users} = useAppSelector((state) => state.user)
    const {user} = useAppSelector((state) => state.user)

    //const {orders} = useAppSelector((state) => state.order)

    const [link, setLink] = useState<Record<number, string>>({})

    const [copied, setCopied] = useState<Record<number, boolean>>({})

    const [query] = useSearchParams()

    const filterString = '?' + query.toString();

    useEffect(() => {
        dispatch(userActions.getManagers(''))
        dispatch(orderActions.getOrders(''))
    }, [dispatch,filterString]);

    const ban = async (id: number) =>  {

        await dispatch(userActions.banManager(id))
        await dispatch(userActions.getManagers(filterString))

    }

    const unban = async (id: number) =>  {

        await dispatch(userActions.unbanManager(id))
        await dispatch(userActions.getManagers(filterString))

    }

    const getLink = async (userId: number) =>  {



        const data = await dispatch(userActions.activateManager(userId))

        const curLink = String(data.payload)

        console.log(curLink)

        setLink(prev => ({
            ...prev,
            [userId]: curLink
        }))



    }

    const copyLink = (userId: number) => {

        console.log(link)

        if (!link) {
            return;
        }

        navigator.clipboard.writeText(link[userId]).then()

        setCopied(prev => ({
            ...prev,
            [userId]: true
        }));

        setLink(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
        });

        setTimeout(() => {
            setCopied(prev => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
        }, 2000);



    }

    return (

        <div>


            <main className={css.mainBox}>

                <div className={css.statsHeader}>
                    <div className={css.statsHeaderBox}><p>Orders statistic</p></div>
                    <div className={css.statsTotalBox}>
                        <p>total:</p>
                        <p>In work:</p>
                        <p>null:</p>
                        <p>Agree:</p>
                        <p>Disagree:</p>
                        <p>Dubbing:</p>
                        <p>New:</p>
                    </div>

                </div>

                <div className={css.createBox}>

                    <button onClick={() => openMenu('manager')}>CREATE</button>

                </div>

                {user && user.is_superuser && users.map((user) =>

                    <section className={css.managerListBox}
                             key={user.id}><div className={css.infoBox}>id: {user.id}<br/>email: {user.email}<br/>name: {user.name}<br/>surname: {user.surname}<br/>is_active: {String(user.is_active)}<br/>last_login: {String(user.last_login_display)}</div>
                        <div className={css.totalBox}><span>Total:</span></div>
                        <div className={css.menuBox}>
                            <div className={css.mainButtonBox}>
                                <button
                                    onClick={() => link[user.id] ? copyLink(user.id) : getLink(user.id)}>{link[user.id] ? "COPY TO CLIPBOARD" : user.is_active ? "CHANGE PASSWORD" : "ACTIVATE"}</button>
                                <button onClick={() => ban(user.id)}>BAN</button>
                                <button onClick={() => unban(user.id)}>UNBAN</button>
                            </div>

                            {copied[user.id] && (<span>Copied to clipboard!</span>)}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminPanelComponent;