import React, {ChangeEvent, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store/store";
import {useSearchParams} from "react-router-dom";
import {orderActions} from "../../redux/slices/orderSlicer";
import css from "./ordersComponent.module.css"

const OrdersComponent = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const orderParam = searchParams.get('order') || '';

    const {orders} = useAppSelector((state) => state.order)
    const loading = useAppSelector((state) => state.order.loading)
    const {groups} = useAppSelector((state) => state.order)

    const dispatch = useAppDispatch()

    const [query] = useSearchParams()

    const filterString = '?' + query.toString();

    useEffect(() => {

        dispatch(orderActions.getOrders(filterString))
        dispatch(orderActions.getGroups())

    }, [dispatch, query, filterString]);

    console.log(groups)

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


    }

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

                    <label>
                        My<input name={"manager"} onChange={handleChangeQuery} className={css.check} type={'checkbox'}/>
                    </label>

                    <label>
                        <button>Refresh</button>
                    </label>
                </form>


                <section>
                    <label>
                        <button>Excl</button>
                    </label>
                </section>

            </nav>

            <main>

                {!loading && <h1>Loading...</h1>}

                {loading && <table>
                    <thead>
                        <tr>
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
                    <tbody>
                    {orders.map((order) => <tr key={order.id} onClick={() => console.log(order.id)}>
                        <td>{order.id ?? "null"}</td>
                        <td>{order.name.toString()}</td>
                        <td>{order.surname ?? "null"}</td>
                        <td>{order.email ?? "null"}</td>
                        <td>{order.phone ?? "null"}</td>
                        <td>{order.age ?? "null"}</td>
                        <td>{order.course ?? "null"}</td>
                        <td>{order.course_format ?? "null"}</td>
                        <td>{order.course_type ?? "null"}</td>
                        <td>{order.status ?? "null"}</td>
                        <td>{order.sum ?? "null"}</td>
                        <td>{order.alreadyPaid ?? "null"}</td>
                        <td>{order.group ?? "null"}</td>
                        <td>{order.created_date ?? "null"}</td>
                        <td>{order.manager ?? "null"}</td>
                    </tr>)}
                    </tbody>
                </table>}

            </main>
        </div>
    );
};

export default OrdersComponent;