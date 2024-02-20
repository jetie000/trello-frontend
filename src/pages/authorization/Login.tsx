import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import { useLogInUserMutation } from '@/store/api/user.api';
import { useActions } from '@/hooks/useActions';
import { Toast as bootstrapToast } from 'bootstrap';
import { AuthResponse } from '@/types/authResponse.interface';
import { IError } from '@/types/error.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function Login() {
    const navigate = useNavigate();
    const { login, setToastChildren } = useActions();
    const [logInUser, { isLoading, isSuccess, isError, data, error }] = useLogInUserMutation();
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("You've succedfully logged in");
            myToast.show();
            login({
                token: (data as AuthResponse)?.accessToken,
                id: (data as AuthResponse)?.id
            });
            navigate('/');
        }
        if (isError) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(((error as FetchBaseQueryError)?.data as IError).message)
            console.log(error);

            myToast.show();
            return;
        }
    }, [isLoading])

    const logIn = () => {
        if (passwordRef.current && emailRef.current &&
            (passwordRef.current.value !== "" ||
                emailRef.current.value !== "")) {
            logInUser({
                email: emailRef.current.value.trim(),
                password: passwordRef.current.value.trim()
            });
            return;
        }
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        setToastChildren("Enter data")
        myToast.show();
    }

    return (
        <div className="mt-3">
            <form>
                <div className="mb-3">
                    <label className="mb-1" htmlFor="inputEmail">Email</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder='Enter e-mail' ref={emailRef} />
                </div>
                <div className="mb-3">
                    <label className="mb-1" htmlFor="inputPassword">Password</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder='Enter password' ref={passwordRef} />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={logIn}>
                    {
                        isLoading ?
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> :
                            'Sign In'

                    }
                </button>
            </form>
        </div>
    )
}
export default Login;
