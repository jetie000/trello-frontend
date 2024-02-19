import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
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
        let inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value;
        let inputPassword = (document.getElementById('inputPassword') as HTMLInputElement).value;
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');

        if (inputEmail == "" || inputPassword == "") {
            setToastChildren("Enter data")
            myToast.show();
            return;
        }
        logInUser({
            email: inputEmail.trim(),
            password: inputPassword.trim()
        });
    }

    return (
        <div className="mt-3">
            <form>
                <div className="mb-3">
                    <label className="mb-1" htmlFor="inputEmail">Email</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder='Enter e-mail' />
                </div>
                <div className="mb-3">
                    <label className="mb-1" htmlFor="inputPassword">Password</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder='Enter password' />
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
