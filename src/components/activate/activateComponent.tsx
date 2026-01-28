import React, {FormEvent, useState} from 'react';
import css from './activateComponent.module.css'
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/store/store";
import {userActions} from "../../redux/slices/userSlicer";

const LoginComponent = () => {

    const [errors, setErrors] = useState<{
        password?: string;
        password_confirm?: string;
    }>({});

    const {token} = useParams()

    const curToken = String(token)

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

    const [password, setPassword] = useState<string>("")
    const [password_confirm, setPassword_confirm] = useState<string>("")

    const navigate = useNavigate()

    const loading = useAppSelector((state) => state.user.loading)

    const dispatch = useAppDispatch()

    const handlePasswordChange = (e: FormEvent<HTMLInputElement>) => {

        const passwordInput = e.target as HTMLInputElement
        const password = passwordInput.value

        const newErrors: typeof errors = {};

        const isPasswordValid = (password: string) => pwdRegex.test(password);

        console.log(isPasswordValid)

        if (password.length >= 8){
            if(!isPasswordValid(password)){

                newErrors.password = "Password must include one lowercase letter, one uppercase letter, one digit, and one non-alphanumeric character (e.g., @, #, $, %, or _), and no whitespace"

            }
            else
            {
                newErrors.password = ""

            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            }

        }
        else
        {
            newErrors.password = "Min 8 char"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }

        setPassword(password)
    }

    const handlePasswordConfirmChange = (e: FormEvent<HTMLInputElement>) => {

        const passwordConfirmInput = e.target as HTMLInputElement
        const password_confirm = passwordConfirmInput.value

        console.log(password_confirm)

        setPassword_confirm(password_confirm)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newErrors: typeof errors = {};

        const checkPassword = (password: string) => pwdRegex.test(password);

        if (password.length >= 8){
            if(!checkPassword(password)){

                newErrors.password = "Password must include one lowercase letter, one uppercase letter, one digit, and one non-alphanumeric character (e.g., @, #, $, %, or _), and no whitespace"

            }
            else
            {
                newErrors.password = ""

            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            }

        }
        else
        {
            newErrors.password = "Min 8 char"
        }

        if(!password_confirm.match(password)){

            newErrors.password_confirm = "Password are not matching"

        }
        else
        {
            newErrors.password_confirm = ""
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }

        if(checkPassword(password) && password_confirm.match(password)) {

            await dispatch(userActions.setPassword({ token: curToken,password: password,confirm_password: password_confirm}))

            navigate(`/login`)

        }
        else
        {

        }

    }

    return (
        <div className={css.BG}>
            <main className={css.mainBox}>
                <form onSubmit={handleSubmit} className={css.formBox} >
                    <label className={css.inputBox}>
                        <p>Password</p>
                        <input disabled={loading} className={css.inputBoxWrite} type={"text"} name={"password"} placeholder={"Password"}
                               onChange={handlePasswordChange}/>
                        {errors?.password && (<span className={css.errorMsg}>{errors.password}</span>)}
                    </label>
                    <label className={css.inputBox}>
                        <p>Password Confirm</p>
                        <input disabled={loading} className={css.inputBoxWrite} type={"password"} name={"password_confirm"} placeholder={"Confirm Password"}
                               onChange={handlePasswordConfirmChange}/>
                        {errors?.password_confirm && (<span className={css.errorMsg}>{errors.password_confirm}</span>)}
                    </label><br/>
                    <button className={css.buttonLogin} disabled={loading}>ACTIVATE</button>
                </form>
            </main>
        </div>
    );
};

export default LoginComponent;