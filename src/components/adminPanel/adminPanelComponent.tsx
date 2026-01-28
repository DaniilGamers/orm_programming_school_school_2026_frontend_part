import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store/store";
import {useSearchParams} from "react-router-dom";
import {userActions} from "../../redux/slices/userSlicer";
import css from "./adminPanel.module.css"

const AdminPanelComponent = () => {

    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.order.loading)

    const {users} = useAppSelector((state) => state.user)
    const {user} = useAppSelector((state) => state.user)

    const [link, setLink] = useState<Record<number, string>>({})

    const [copied, setCopied] = useState<Record<number, boolean>>({})

    const [query] = useSearchParams()

    const filterString = '?' + query.toString();

    useEffect(() => {
        dispatch(userActions.getManagers(filterString))
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
                    <p>Orders statistic</p>
                </div>

                <div className={css.createBox}>

                    <button>CREATE</button>

                </div>

                {user && user.is_superuser && users.map((user) =>

                    <section className={css.managerListBox}
                             key={user.id}>id: {user.id}<br/>email: {user.email}<br/>name: {user.name}<br/>surname: {user.surname}<br/>is_active: {String(user.is_active)}<br/>last_login: {String(user.last_login_display)}
                        <div><p>Total</p></div>
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