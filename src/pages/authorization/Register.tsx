import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/modal/Modal'
import { useRegisterUserMutation } from '@/store/api/user.api';
import { Toast as bootstrapToast } from 'bootstrap';
import { useActions } from '@/hooks/useActions';
import { IError } from '@/types/error.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function Register() {
    const [registerUser, { isLoading, isSuccess, isError, data, error }] = useRegisterUserMutation();
    const { setToastChildren } = useActions();
    const fullNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        if (isSuccess && fullNameRef.current && passwordRef.current && emailRef.current) {
            setToastChildren("You've succesfully registered. Check your e-mail for confirm letter");
            fullNameRef.current.value = ''
            passwordRef.current.value = ''
            emailRef.current.value = ''
            myToast.show()
        }
        if (isError) {
            console.log(error);

            setToastChildren(((error as FetchBaseQueryError)?.data as IError).message)
            myToast.show()
        }

    }, [isLoading])

    const registerClick = () => {
        if (fullNameRef.current && passwordRef.current && emailRef.current &&
            (fullNameRef.current.value === "" ||
                passwordRef.current.value === "" ||
                emailRef.current.value === "")) {
            registerUser({
                email: emailRef.current.value.trim(),
                password: passwordRef.current.value.trim(),
                fullName: fullNameRef.current.value.trim()
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
                    <label htmlFor="inputFullName">Surname and name</label>
                    <input className="form-control" id="inputFullName" placeholder='Enter surname and name' ref={fullNameRef} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail">Email</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder='Enter e-mail' ref={emailRef} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword">Password</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder='Enter password' ref={passwordRef} />
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