import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store/store";
import {userActions} from "../../redux/slices/userSlicer";
import css from "./adminPanel.module.css"
import {useCreateMenu} from "../../redux/context/CreateMenuContext";
import {orderActions, StatusCount} from "../../redux/slices/orderSlicer";

const AdminPanelComponent = () => {

    const dispatch = useAppDispatch()

    // loading = useAppSelector((state) => state.order.loading)

    const { openMenu } = useCreateMenu()

    const {users} = useAppSelector((state) => state.user)
    const {user} = useAppSelector((state) => state.user)

    const { statusSumCount, managerStatusCount } = useAppSelector((state) => state.order);

    const [link, setLink] = useState<Record<number, string>>({})

    const [copied, setCopied] = useState<Record<number, boolean>>({})

    useEffect(() => {
        dispatch(userActions.getManagers(''))
        dispatch(orderActions.getStatusOrdersCount(''))

    }, [dispatch]);

    useEffect(() => {
        if (!user?.name) return;
            // This won't overwrite global slice
            users.forEach(u => {
                dispatch(orderActions.getStatusOrdersCount(u.name))
            });

    }, [dispatch, user?.name, users]);

    const ban = async (id: number) =>  {

        await dispatch(userActions.banManager(id))
        await dispatch(userActions.getManagers(''))

    }

    const unban = async (id: number) =>  {

        await dispatch(userActions.unbanManager(id))
        await dispatch(userActions.getManagers(''))

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

    const getStatusTotal = (count: StatusCount | null, status?: any) => {
        if (!count) return 0;
        if (!status) return count.total;
        return count.by_status.find(s => s.status === status)?.total ?? 0;
    };
    const getManagerStatusTotal = (managerName: string) => {
        const managerStatus = managerStatusCount[managerName]; // get manager's count
        if (!managerStatus) return 0; // no orders yet
        return managerStatus.total;
    };

    const getNonZeroStatuses = (statusData?: StatusCount) => {
        if (!statusData) return [];
        return statusData.by_status.filter(s => s.total > 0);
    };

    return (

        <div>


            <main className={css.mainBox}>

                <div className={css.statsHeader}>
                    <div className={css.statsHeaderBox}><p>Orders statistic</p></div>
                    <div className={css.statsTotalBox}>
                        <p>total: {getStatusTotal(statusSumCount)}</p>
                        <p>In work: {getStatusTotal(statusSumCount, "In Work")}</p>
                        <p>Agree: {getStatusTotal(statusSumCount, "Agree")}</p>
                        <p>Disagree: {getStatusTotal(statusSumCount, "Disagree")}</p>
                        <p>Dubbing: {getStatusTotal(statusSumCount, "Dubbing")}</p>
                        <p>New: {getStatusTotal(statusSumCount, "New")}</p>
                    </div>

                </div>

                <div className={css.createBox}>

                    <button onClick={() => openMenu('manager')}>CREATE</button>

                </div>

                {user && user.is_superuser && users.map((user) =>

                    <section className={css.managerListBox}
                             key={user.id}><div className={css.infoBox}>id: {user.id}<br/>email: {user.email}<br/>name: {user.name}<br/>surname: {user.surname}<br/>is_active: {String(user.is_active)}<br/>last_login: {String(user.last_login_display)}</div>
                        <div className={css.totalBox}>
                            <div> Total: {getManagerStatusTotal(user.name)}</div>
                            <div>{getNonZeroStatuses(managerStatusCount[user.name]).map((s) => s.status === "In Work" && s.total > 0 ? (<div key={s.status}> In Work: {getManagerStatusTotal(user.name)}</div>) : null)}</div>
                            <div>{getNonZeroStatuses(managerStatusCount[user.name]).map((s) => s.status === "Agree" && s.total > 0 ? (<div key={s.status}> In Work: {getManagerStatusTotal(user.name)}</div>) : null)}</div>
                            <div>{getNonZeroStatuses(managerStatusCount[user.name]).map((s) => s.status === "Disagree" && s.total > 0 ? (<div key={s.status}> In Work: {getManagerStatusTotal(user.name)}</div>) : null)}</div>
                            <div>{getNonZeroStatuses(managerStatusCount[user.name]).map((s) => s.status === "Dubbing" && s.total > 0 ? (<div key={s.status}> In Work: {getManagerStatusTotal(user.name)}</div>) : null)}</div>
                        </div>
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