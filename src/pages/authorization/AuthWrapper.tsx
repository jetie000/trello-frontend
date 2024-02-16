import React from "react";
import { Link, Navigate } from 'react-router-dom';
import './Auth.scss'
import { ReactElement } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function AuthWrapper({ children }: { children: ReactElement[] | ReactElement }) {

    const { token } = useSelector((state: RootState) => state.user);

    return !token ?
        <div className="position-absolute d-flex main-window" >
            <div className="border rounded p-5 inner-window">
                <ul className="navbar-nav flex-row justify-content-between gap-3">
                    <li className="nav-item w-100">
                        <Link className="btn w-100 btn-outline-primary" to={'/login'}>Sign In</Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link className="btn w-100 btn-outline-primary" to={'/register'}>Register</Link>
                    </li>
                </ul>
                {children}
            </div>
        </div> :
        <Navigate to={'/'} />;
}

export default AuthWrapper;
