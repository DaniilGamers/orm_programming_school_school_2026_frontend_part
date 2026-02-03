import React, {FormEvent, useState} from 'react';
import css from './loginComponent.module.css'
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/store/store";
import {authActions} from "../../redux/slices/authSlicer";
const LoginComponent = () => {

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        general?: string;
    }>({});


    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const {loading, error} = useAppSelector((state) => state.auth)

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleEmailChange = (e: FormEvent<HTMLInputElement>) => {

        const emailInput = e.target as HTMLInputElement
        const email = emailInput.value

        setEmail(email)

        const newErrors: typeof errors = {};

        if(email.length < 1){

            newErrors.email = "Min 1 char"

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            }

        }
        else
        {
            newErrors.password = ""

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            }
        }
    }

    const handlePasswordChange = (e: FormEvent<HTMLInputElement>) => {

        const passwordInput = e.target as HTMLInputElement
        const password = passwordInput.value

        setPassword(password)

        const newErrors: typeof errors = {};

        if(!password){

            newErrors.password = "Password is required"

        }

        if (password){

            newErrors.password = ""

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }

    }



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newErrors: typeof errors = {};

        if(email.length < 1){

            newErrors.email = "Min 1 char"

        }

        if(!password){

            newErrors.password = "Password is required"

        }

        if (password){

            newErrors.password = ""

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            }
        }
        else
        {

        }

        if(password && email) {

            String(password)

            await dispatch(authActions.login({email, password})).unwrap()

            setEmail("")

            setPassword("")

            if (errors)

            navigate(`/orders`)

        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

    }

    return (
        <div className={css.BG}>
            <main className={css.mainBox}>
                <form onSubmit={handleSubmit} className={css.formBox} noValidate >
                    <label className={css.inputBox}>
                        <p>Email</p>
                        <input className={css.inputBoxWrite} type={"email"} name={"email"} placeholder={"Email"}
                               onChange={handleEmailChange} disabled={loading}/>
                    {errors?.email && (<span className={css.errorMsg}>{errors.email}</span>)}
                    </label>
                    <label className={css.inputBox}>
                        <p>Password</p>
                        <input className={css.inputBoxWrite} type={"password"} name={"email"} placeholder={"Password"}
                               onChange={handlePasswordChange} disabled={loading}/>
                        {errors?.password && (<span className={css.errorMsg}>{errors.password}</span>)}
                        {error && (<span className={css.errorMsg}>{error}</span>)}
                    </label><br/>
                        <button className={css.buttonLogin} disabled={loading}>{loading ? "LOADING...": 'LOGIN'}</button>
                </form>
            </main>
        </div>
    );
};

export default LoginComponent;