import React, { useEffect, useState } from 'react';
import Modal from '@/pages/modal/Modal'
import { useRegisterUserMutation } from '@/store/api/user.api';
import { Toast as bootstrapToast } from 'bootstrap';
import { useActions } from '@/hooks/useActions';
import { IError } from '@/types/error.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function Register() {
    const [registerUser, { isLoading, isSuccess, isError, data, error }] = useRegisterUserMutation();
    const { setToastChildren } = useActions();

    useEffect(() => {
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        if (isSuccess) {
            setToastChildren("You've succesfully registered\nCheck your e-mail for confirm letter");
            (document.getElementById('inputFullName') as HTMLInputElement).value = '';
            (document.getElementById('inputEmail') as HTMLInputElement).value = '';
            (document.getElementById('inputPassword') as HTMLInputElement).value = '';
            myToast.show()
        }
        if (isError) {
            console.log(error);
            
            setToastChildren(((error as FetchBaseQueryError)?.data as IError).message)
            myToast.show()
        }

    }, [isLoading])

    const registerClick = () => {
        let inputFullName = (document.getElementById('inputFullName') as HTMLInputElement).value;
        let inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value;
        let inputPassword = (document.getElementById('inputPassword') as HTMLInputElement).value;
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        if (inputEmail == "" || inputPassword == "" || inputFullName == "") {
            setToastChildren("Enter data")
            myToast.show();
            return;
        }
        console.log(inputEmail, ' ', inputFullName, ' ', inputPassword);

        registerUser({
            email: inputEmail.trim(),
            password: inputPassword.trim(),
            fullName: inputFullName.trim()
        });
    }

    return (
        <div className="mt-3">
            <form>
                <div className="mb-3">
                    <label htmlFor="inputFullName">Surname and name</label>
                    <input className="form-control" id="inputFullName" placeholder='Enter surname and name' />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail">Email</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder='Enter e-mail' />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword">Password</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder='Enter password' />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => registerClick()}>
                    {
                        isLoading ?
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> :
                            'Sign Up'

                    }
                </button>
            </form>
        </div>
    )
}

export default Register;