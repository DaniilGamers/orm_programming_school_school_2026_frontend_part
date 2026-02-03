import React, {ChangeEvent, useState} from 'react';
import css from './createManager.module.css'
import {useCreateMenu} from "../../../redux/context/CreateMenuContext";
import {useAppDispatch} from "../../../redux/store/store";
import {userActions} from "../../../redux/slices/userSlicer";

const CreateManagerComponent = () => {

    const [errors, setErrors] = useState<{
        email?: string;
        name?: string;
        surname?: string;
    }>({});

    const { activeMenu, closeMenu } = useCreateMenu();

    const [formList, setFormList] = useState({
        email: '',
        name: '',
        surname: '',
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const dispatch = useAppDispatch()

    if (activeMenu !== 'manager') return null;

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setFormList(prev => ({ ...prev, email: value }));

        setErrors(prev => ({
            ...prev,
            email:
                value.length < 1
                    ? "Email required"
                    : !emailRegex.test(value)
                        ? "Invalid email format"
                        : undefined,
        }));
    };

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setFormList(prev => ({ ...prev, name: value }));

        setErrors(prev => ({
            ...prev,
            name: value.length < 1 ? 'Min 1' : undefined
        }));
    };

    const handleChangeSurname = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setFormList(prev => ({ ...prev, surname: value }));

        setErrors(prev => ({
            ...prev,
            surname: value.length < 1 ? 'Min 1' : undefined
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault()

        const newErrors: typeof errors = {};

        if (!formList.email) {
            newErrors.email = "Email required";
        } else if (!emailRegex.test(formList.email)) {
            newErrors.email = "Invalid email format";
        }


        if (!formList.name) {
            newErrors.name = "Min 1 character";
        } else if (formList.name.length < 1) {
            newErrors.name = "Min 1 character";
        }


        if (!formList.surname) {
            newErrors.surname = "Min 1 character";
        } else if (formList.surname.length < 1) {
            newErrors.surname = "Min 1 character";
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }


        await dispatch(userActions.createManager(formList));
        await dispatch(userActions.getManagers());

        setFormList({ email: '', name: '', surname: '' });
        setErrors({});
        closeMenu();


    }

    return (
        <div className={css.background} onClick={closeMenu}>

            <div className={css.createFormBox} onClick={(e) => e.stopPropagation()}>

                <form onSubmit={handleSubmit} className={css.formBox}>

                    <label className={css.inputBox}>

                        Email
                        <input className={css.inputBoxWrite} type={"email"} placeholder={"Email"} onChange={handleChangeEmail}/>

                        {errors?.email && (<span className={css.errorMsg}>{errors.email}</span>)}

                    </label>

                    <label className={css.inputBox}>

                        Name
                        <input className={css.inputBoxWrite} type={"text"} placeholder={"Name"}
                               onChange={handleChangeName}/>

                        {errors?.name && (<span className={css.errorMsg}>{errors.name}</span>)}

                    </label>

                    <label className={css.inputBox}>

                        Surname
                        <input className={css.inputBoxWrite} type={"text"} placeholder={"Surname"}
                               onChange={handleChangeSurname}/>

                        {errors?.surname && (<span className={css.errorMsg}>{errors.surname}</span>)}

                    </label>

                    <div className={css.boxButtonsBoxMain}>

                        <div className={css.boxButtonsBox}>

                            <button className={css.buttons} onClick={closeMenu}>CANCEL</button>
                            <button className={css.buttons} name={"create"}>CREATE</button>
                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateManagerComponent;