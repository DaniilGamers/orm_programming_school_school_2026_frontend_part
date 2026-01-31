import React, {ChangeEvent, useEffect, useState} from 'react';
import css from './editOrderComponent.module.css'
import {useCreateMenu} from "../../../redux/context/CreateMenuContext";
import {useDispatch} from "react-redux";
import {orderActions} from "../../../redux/slices/orderSlicer";
import {AppDispatch, useAppSelector} from "../../../redux/store/store";
import {OrderEditModel} from "../../../models/OrderEditModel";
const EditOrderComponent = () => {

    const [errors, setErrors] = useState<{ name?: string }>({});

    const { activeMenu, closeMenu } = useCreateMenu();

    const [groupName, setGroupName] = useState<string>('')

    const [addGroup, setAddGroup] = useState<boolean>(false)

    const [groupMenu, setGroupMenu] = useState<boolean>(false)

    const dispatch = useDispatch<AppDispatch>()

    const { user } = useAppSelector((state) => state.user)

    const {groups} = useAppSelector((state) => state.order)

    const {group} = useAppSelector((state) => state.order)

    const { order } = useAppSelector(state => state.order);

    type EditOrderForm = {
        manager: string | null; // always string
        status: string;
        group_id: string;
        name: string;
        surname: string;
        email: string;
        phone: string;
        sum: string;
        paid: string;
        age: string;
        course: string;
        courseType: string;
        courseFormat: string;
    };

    const [form, setForm] = useState<EditOrderForm>({
        manager: '',
        status: '',
        group_id: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        sum: '',
        paid: '',
        age: '',
        course: '',
        courseType: '',
        courseFormat: ''
    });

    useEffect(() => {
        if (!order) return;

        setForm({
            group_id: group?.id ? String(group.id) : '',
            status: order.status ?? '',
            manager: order.manager ?? '',
            name: order.name ?? '',
            surname: order.surname ?? '',
            email: order.email ?? '',
            phone: String(order.phone ?? ''),
            sum: String(order.sum ?? ''),
            paid: String(order.alreadyPaid ?? ''),
            age: String(order.age ?? ''),
            course: order.course ?? '',
            courseType: order.course_type ?? '',
            courseFormat: order.course_format ?? ''
        });
    }, [group?.id, order?.id, order]);

    useEffect(() => {
        if (!errors.name) return;

        const timer = setTimeout(() => {
            setErrors({});
        }, 3000); // 3 seconds

        return () => clearTimeout(timer); // cleanup
    }, [errors.name]);

    const handleAddGroup = (e: ChangeEvent<HTMLInputElement>) => {
        const group = e.target as HTMLInputElement
        const groupName = group.value

        setGroupName(groupName)


    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const name = groupName

        if (addGroup && groupMenu){
            const isDuplicate = groups.some(
                g => g.name.toLowerCase() === name.toLowerCase()
            );

            if (isDuplicate) {
                setErrors({ name: 'group model with this name already exists.' });
                return;
            }

            if (name.length === 0) {
                setErrors({ name: 'This field may not be blank.' });
                return;
            }

            await dispatch(orderActions.addGroup({ name })).unwrap();
            await dispatch(orderActions.getGroups());
            setForm(prev => ({
                ...prev,
                group_id: groupName
            }));

            setAddGroup(false)

            return
        }
        else
        {

            const payload: OrderEditModel['data'] = {
                name: form.name,
                surname: form.surname,
                email: form.email,
                phone: Number(form.phone),
                age: Number(form.age),
                course: form.course,
                course_format: form.courseFormat,
                course_type: form.courseType,
                sum: Number(form.sum),
                alreadyPaid: Number(form.paid),
                status: form.status,
                // @ts-ignore
                manager: form.status === 'New' ? null : form.manager || null,
                // @ts-ignore
                group_id: form.group_id ? Number(form.group_id) : null
            };

            await dispatch(orderActions.editOrder({ id: Number(order?.id), ...payload })).unwrap();

            await dispatch(orderActions.getOrders(''))

            closeMenu()
        }


        setGroupMenu(true)


    }
    if (activeMenu !== 'order') return null;

    return (
        <div className={css.background}>
            <div className={css.editFormBox}>
                <form className={css.formBox} onSubmit={handleSubmit} noValidate >

                    <div className={css.labelBox}>

                        <div>

                            <div className={css.rowBox}>

                                <div className={css.rowPartBox}>

                                    <span>Group</span>

                                    {!addGroup ? (<select value={form.group_id} onChange={e => setForm({ ...form, group_id: e.target.value })}>
                                        <option value={''}>all groups</option>
                                        {groups.map((group) => <option key={group.id} value={String(group.id)} >{group.name}</option>)}
                                    </select>) : <input onChange={handleAddGroup} value={groupName} type={"text"} placeholder={"Add group"}/>}

                                    {!addGroup ? (<div className={css.rowPartButtonBox}>
                                        <button type="button" onClick={() => setAddGroup(true)}>ADD GROUP</button>
                                    </div>) : (<div className={css.rowPartButtonBox}>
                                        <button>ADD</button>
                                        <button type="button" onClick={() => {
                                            setAddGroup(false)
                                            setGroupMenu(false)
                                            setErrors({})
                                        }}>SELECT</button>
                                    </div>)}

                                    {errors.name && (<span>{errors.name}</span>)}

                                </div>
                                <div className={css.rowPartBox}>

                                    <span>Status</span>

                                    <select value={form.status} name={"status"} className={css.Inputs} onChange={e =>{
                                        const newStatus = e.target.value;
                                        setForm(prev => ({
                                            ...prev,
                                            status: newStatus,
                                            manager: newStatus === 'New' ? '' : user?.name ?? ''
                                        }))
                                    }}>
                                        <option value={''}>All status</option>
                                        <option value={'In Work'}>In work</option>
                                        <option value={'New'}>New</option>
                                        <option value={'Aggre'}>Aggre</option>
                                        <option value={'Disable'}>Disable</option>
                                        <option value={'Dubbing'}>Dubbing</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={css.rowBox}>
                            <div className={css.rowPartBox}>

                                <span>Name</span>

                                <input value={form.name} type={"text"} placeholder={"Name"} onChange={e => setForm({ ...form, name: e.target.value })}/>
                            </div>
                            <div className={css.rowPartBox}>

                                <span>Sum</span>

                                <input value={form.sum} type={"text"} placeholder={"Sum"} onChange={e => setForm({ ...form, sum: e.target.value })}/>
                            </div>
                        </div>
                        <div className={css.rowBox}>
                            <div className={css.rowPartBox}>
                                <span>Surname</span>
                                <input value={form.surname} type={"text"} placeholder={"Surname"} onChange={e => setForm({ ...form, surname: e.target.value })}/>
                            </div>
                            <div className={css.rowPartBox}>
                                <span>Already paid</span>
                                <input value={form.paid} type={"text"} placeholder={"Already paid"} onChange={e => setForm({ ...form, courseType: e.target.value })}/>
                            </div>
                        </div>

                        <div className={css.rowBox}>
                            <div className={css.rowPartBox}>

                                <span>Email</span>
                                <input value={form.email} type={"email"} placeholder={"Email"} onChange={e => setForm({ ...form, email: e.target.value })}/>
                            </div>
                            <div className={css.rowPartBox}>
                                <span>Course</span>
                                <select value={form.course} name={"course"} className={css.Inputs} onChange={e => setForm({ ...form, course: e.target.value })}>
                                    <option value={''}>All courses</option>
                                    <option>FS</option>
                                    <option>QACX</option>
                                    <option>JCX</option>
                                    <option>JSCX</option>
                                    <option>FE</option>
                                    <option>PCX</option>
                                </select>
                            </div>
                        </div>

                        <div className={css.rowBox}>
                            <div  className={css.rowPartBox}>
                                <span>Phone</span>
                                <input value={form.phone} type={"text"} placeholder={"Phone"} onChange={e => setForm({ ...form, phone: e.target.value })}/>
                            </div>

                            <div className={css.rowPartBox}>
                                <span>Course format</span>
                                <select value={form.courseFormat} name={"course_format"} className={css.Inputs} onChange={e => setForm({ ...form, courseFormat: e.target.value })}>
                                    <option value={''}>All formats</option>
                                    <option>static</option>
                                    <option>online</option>
                                </select>
                            </div>

                        </div>

                        <div className={css.rowBox}>
                            <div className={css.rowPartBox}>
                                <span>Age</span>
                                <input value={form.age} type={"text"} placeholder={"Age"} onChange={e => setForm({ ...form, age: e.target.value })}/>
                            </div>

                            <div className={css.rowPartBox}>
                                <span>Course type</span>
                                <select value={form.courseType} name={"course_type"} className={css.Inputs} onChange={e => setForm({ ...form, courseType: e.target.value })}>
                                    <option value={''}>All types</option>
                                    <option>pro</option>
                                    <option>minimal</option>
                                    <option>premium</option>
                                    <option>incubator</option>
                                    <option>vip</option>
                                </select>
                            </div>

                        </div>

                    </div>

                    <div className={css.optionBtnBox}>

                        <button onClick={() => closeMenu()}>CLOSE</button>
                        <button>SUBMIT</button>

                    </div>

                </form>


            </div>

        </div>
    );
};

export default EditOrderComponent;