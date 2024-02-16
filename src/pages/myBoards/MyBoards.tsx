import { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function MyBoards() {
    const { token, id } = useSelector((state: RootState) => state.user);

    if (!token) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div>
            <h1>
                My boards
            </h1>
        </div>
    );
}

export default MyBoards;