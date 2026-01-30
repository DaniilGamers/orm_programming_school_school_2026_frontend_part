import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store/store";
import {useSearchParams} from "react-router-dom";
import {orderActions} from "../../redux/slices/orderSlicer";
import css from "./ordersComponent.module.css"
import {userActions} from "../../redux/slices/userSlicer";
import resetIcon from "../../assets/reset.51c9a5b2e5527c0bfbcaf74793deb908.svg"
import fileIcon from "../../assets/xls.476bc5b02e8b94a61782636d19526309.svg"
import PaginationComponent from "../pagination/paginationComponent";


const OrdersComponent = () => {

    const [page, setPage] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();

    const orderParam = searchParams.get('order') || '';

    const {orders} = useAppSelector((state) => state.order)

    const count = useAppSelector((state) => state.order.count)

    const loading = useAppSelector((state) => state.order.loading)

    const {groups} = useAppSelector((state) => state.order)

    const {user} = useAppSelector((state) => state.user)

    const [expandedId, setExpandedId] = useState<number | null>(null);

    const {comments} = useAppSelector((state) => state.order)

    const dispatch = useAppDispatch()

    const [query] = useSearchParams()

    const filterString = '?' + query.toString();

    useEffect(() => {

        dispatch(orderActions.getOrders(filterString))
        dispatch(userActions.getManagerName())
        dispatch(orderActions.getGroups())

    }, [dispatch, query, filterString]);

    const handleLoadComments = async (orderId: number) => {
        const response = await dispatch(orderActions.getComments(orderId));
        console.log(response.payload)
    };

    const HandleOrderQuery = (key: string) => {

        const params = new URLSearchParams(searchParams);

        if (!params.has('page')) params.set('page', '1');

        if (orderParam === key) {

            params.set('order', `-${key}`);
        } else if (orderParam === `-${key}`) {

            params.set('order', key);
        } else {
            // New column, default ascending
            params.set('order', key);
        }

        setSearchParams(params);

        setExpandedId(0)

    }

    const handleChangeQuery = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        const target = e.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
        const name = target.name || (target instanceof HTMLInputElement ? target.placeholder : '');
        let value: string | string[];

            if (target instanceof HTMLSelectElement && target.multiple) {
                value = Array.from(target.selectedOptions).map((o) => o.value);
            } else {
                value = target.value;
            }

            if (Array.isArray(value)) {
                params.delete(name);
                value.forEach((v) => {
                    if (v && !v.toLowerCase().startsWith('all')) params.append(name, v);
                });
            } else {
                if (value && !value.toLowerCase().startsWith('all')) params.set(name, value);
                else params.delete(name);
            }// reset page on filter change

        setSearchParams(params);

        setExpandedId(0)


    }

    const handleCheckQuery = (e: ChangeEvent<HTMLInputElement>) => {


        const checked = e.target.checked

        const qsName = e.target.name

        const name = String(user?.name)

        const params = new URLSearchParams(searchParams);

        if(checked){

            if (!params.has('page')) params.set('page', '1');

            params.set(qsName, name)

            setSearchParams(params);

            setExpandedId(0)
        }
        else if(!checked){
            params.delete(qsName)

            setSearchParams(params);

            setExpandedId(0)
        }


    }

    const handleQueryReset = (e: FormEvent<HTMLButtonElement>) => {

        e.preventDefault()

        let resetParams = ''

        setSearchParams(resetParams)

        let newParams = '?page=1&order=-id'

        setSearchParams(newParams)

        setExpandedId(0)

        window.location.reload()



    }

    const handleDownload = async () => {

        await dispatch(orderActions.getExcel())
    }

    const [text, setText] = useState<string>('')

    const handleComment = (e: ChangeEvent<HTMLInputElement>) => {


        const msgInput = e.target as HTMLInputElement
        const msg = msgInput.value.toString()

        if(msg.length < 1){
            return
        }else{
            setText(msg)


        }

    }

    const handleSubmitComment = async (e: FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault()

        if(text.length > 0){
            await dispatch(orderActions.sendComment({orderId: id, text }))

        }
        await dispatch(orderActions.getComments(id));
    }

    const displayValue = (value?: string | number | null) => {
        if (value === null || value === undefined) return 'null';
        if (typeof value === 'string' && value.trim() === '') return 'null';
        return value;
    };



    return (
        <div>
            <nav className={css.filterBox}>

                <form className={css.InputsMain}>

                    <section className={css.InputsBox}>

                        <div>

                            <label className={css.InputsLabel}>
                                <input onChange={handleChangeQuery} className={css.Inputs} type={'text'} placeholder={'name'}/>
                            </label>

                        </div>

                        <div>

                            <label>
                                <input onChange={handleChangeQuery} className={css.Inputs} type={'text'} placeholder={'surname'}/>
                            </label>

                        </div>

                        <div>
                            <label>
                                <input onChange={handleChangeQuery} className={css.Inputs} type={'text'} placeholder={'email'}/>
                            </label>

                        </div>

                        <div>
                            <label>
                                <input onChange={handleChangeQuery} className={css.Inputs} type={'text'} placeholder={'phone'}/>
                            </label>

                        </div>

                        <div>

                            <label>
                                <input onChange={handleChangeQuery} className={css.Inputs} type={'text'} placeholder={'age'}/>
                            </label>

                        </div>

                        <div>
                            <label>
                                <select name={"course"}  className={css.Inputs} onChange={handleChangeQuery}>
                                    <option>All courses</option>
                                    <option>FS</option>
                                    <option>QACX</option>
                                    <option>JCX</option>
                                    <option>JSCX</option>
                                    <option>FE</option>
                                    <option>PCX</option>
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                <select name={"course_format"} className={css.Inputs} onChange={handleChangeQuery}>
                                    <option>All formats</option>
                                    <option>static</option>
                                    <option>online</option>
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                <select name={"course_type"} className={css.Inputs} onChange={handleChangeQuery}>
                                    <option>All types</option>
                                    <option>pro</option>
                                    <option>minimal</option>
                                    <option>premium</option>
                                    <option>vip</option>
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                <select name={"status"} className={css.Inputs} onChange={handleChangeQuery}>
                                    <option>All status</option>
                                    <option>In work</option>
                                    <option>New</option>
                                    <option>Aggre</option>
                                    <option>Disable</option>
                                    <option>Dubbing</option>
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                <select name={"group"} className={css.Inputs} onChange={handleChangeQuery}>
                                    <option>All groups</option>
                                    {groups.map((group) => <option key={group.id}>{group.name}</option>)}
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                <input className={css.Inputs} type={'text'} placeholder={'Start date'} onChange={handleChangeQuery}/>
                            </label>
                        </div>

                        <div>
                            <label>
                                <input className={css.Inputs} type={'text'} placeholder={'End date'} onChange={handleChangeQuery}/>
                            </label>
                        </div>

                    </section>

                    <label className={css.checkBox}>
                        <input className={css.checkInputBox} name={"manager"} onChange={handleCheckQuery} type={'checkbox'}/>My
                    </label>

                    <label className={css.resetBox}>
                        <button className={css.buttonsFilter} onClick={handleQueryReset}><img className={css.resetIconBtn} src={resetIcon} alt={''} /></button>
                    </label>
                </form>


                <section>
                    <label>
                        <button className={css.buttonsFilter} onClick={handleDownload}><img className={css.fileIconBtn} src={fileIcon} alt={''}/></button>
                    </label>
                </section>

            </nav>

            <main>

                {!loading && <h1>Loading...</h1>}

                {loading && <table className="orders-table">
                    <thead>
                        <tr className="bg-green-500 text-white">
                            <th onClick={() => HandleOrderQuery('id')}>id</th>
                            <th onClick={() => HandleOrderQuery('name')}>name</th>
                            <th onClick={() => HandleOrderQuery('surname')}>surname</th>
                            <th onClick={() => HandleOrderQuery('email')}>email</th>
                            <th onClick={() => HandleOrderQuery('phone')}>phone</th>
                            <th onClick={() => HandleOrderQuery('age')}>age</th>
                            <th onClick={() => HandleOrderQuery('course')}>course</th>
                            <th onClick={() => HandleOrderQuery('course_format')}>course_format</th>
                            <th onClick={() => HandleOrderQuery('course_type')}>course_type</th>
                            <th onClick={() => HandleOrderQuery('status')}>status</th>
                            <th onClick={() => HandleOrderQuery('sum')}>sum</th>
                            <th onClick={() => HandleOrderQuery('alreadyPaid')}>alreadyPaid</th>
                            <th onClick={() => HandleOrderQuery('group')}>group</th>
                            <th onClick={() => HandleOrderQuery('created_at')}>created_at</th>
                            <th onClick={() => HandleOrderQuery('manager')}>manager</th>
                        </tr>
                    </thead>

                    {orders.map((order, index) => <tbody key={order.id}>
                    <tr style={{
                        backgroundColor: index % 2 === 0 ? "#f3f3f3" : "lightgrey",
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#76b852")}
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                index % 2 === 0 ? "#f3f3f3" : "lightgrey")}
                        onClick={() => {
                            setExpandedId(expandedId === order.id ? null : order.id)
                            handleLoadComments(order.id)
                        }}>
                        <td>{displayValue(order.id)}</td>
                        <td>{displayValue(order.name)}</td>
                        <td>{displayValue(order.surname)}</td>
                        <td>{displayValue(order.email)}</td>
                        <td>{displayValue(order.phone)}</td>
                        <td>{displayValue(order.age)}</td>
                        <td>{displayValue(order.course)}</td>
                        <td>{displayValue(order.course_format)}</td>
                        <td>{displayValue(order.course_type)}</td>
                        <td>{displayValue(order.status)}</td>
                        <td>{displayValue(order.sum)}</td>
                        <td>{displayValue(order.alreadyPaid)}</td>
                        <td>{displayValue(order.group)}</td>
                        <td>{displayValue(order.created_date)}</td>
                        <td>{displayValue(order.manager)}</td>
                    </tr>
                    {expandedId === order.id && (<tr key={order.id}>
                        <td colSpan={15} className={css.openWindowBox}
                            style={{backgroundColor: index % 2 === 0 ? "#f3f3f3" : "lightgrey",}}
                        >
                            <div className={css.windowBox}>
                                <div className={css.messageBox}>
                                    UTM: {displayValue(order.utm)}<br/>
                                    msg: {displayValue(order.msg)}
                                </div>
                                <div className={css.commentBox}>
                                    {comments.length === 0 ? ('') : (<div  key={order.id} className={css.commentView}>

                                        {comments
                                            .filter(comment => comment.order_id === order.id)
                                            .sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
                                            .map((comment, i) => (
                                                <div key={comment.id} className={css.commentMsgBox} style={{borderBottom: i % 1 === 0 ? '1px solid #ccc' : 'none', paddingBottom: '8px'}}>
                                                    <div>{comment.text}</div>
                                                    <div>{comment.sender_name} {comment.created_date}</div>
                                                </div>
                                            ))}

                                    </div>)}
                                    <div className={css.commentInputBox}>
                                        <form className={css.commentInputWindow} onSubmit={(e) => handleSubmitComment(e,order.id)}>
                                            <label>
                                                <input onChange={handleComment} type={"text"} placeholder={"Comment"}/>
                                                <button>SUBMIT</button>
                                            </label>
                                        </form>
                                    </div>
                                </div>
                                <div className={css.editBtnBox}>
                                    <button>EDIT</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    )}</tbody>
                    )}

                </table>}
            </main>

            <PaginationComponent currentPage={Number(page)} total_count={count} onPageChange={setPage}/>
        </div>
    );
};

export default OrdersComponent;