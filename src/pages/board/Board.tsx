import { useGetBoardByIdQuery } from '@/store/api/board.api';
import * as React from 'react';
import { useParams } from 'react-router';
import './Board.scss'
import { useMemo } from 'react';
import Columns from './Columns';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { IError } from '@/types/error.interface';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '@/store/store';

function Board() {
    const { token } = useSelector((state: RootState) => state.user);

    if (!token) {
        return <Navigate to={'/login'} />;
    }

    const { id } = useParams()
    const { isLoading, isError, data, error } = useGetBoardByIdQuery(Number(id));

    const creatorName = useMemo(
        () => data && 'name' in data && data.users?.find(u => u.id === data.creatorId)?.fullName,
        [data])

    return isLoading ?
        <div className="spinner-border m-auto" role="status">
            < span className="visually-hidden" > Loading...</span >
        </div >
        : isError ? <h1 className='m-auto'>{((error as FetchBaseQueryError).data as IError).message}</h1>
            : data && 'name' in data &&
            <div className='d-flex gap-2 flex-fill min-w-0'>
                <div className='d-flex flex-column board-info gap-2'>
                    <div className="d-flex flex-column border rounded-2 p-3 ">
                        <h4 className='text-center'>{data && data.name}</h4>
                        <h6 className='text-center'>Creator: {creatorName}</h6>
                        {
                            data?.description &&
                            <h5>
                                {data.description}
                            </h5>
                        }
                    </div>
                    <ul className="list-group overflow-y-auto ">
                        {
                            data && data.users?.map(user =>
                                <li className='list-group-item d-flex gap-3' key={user.id}>
                                    <div className="border rounded-circle d-flex 
                                    align-items-center justify-content-center 
                                    bg-secondary text-light fs-4 board-users-avatar">
                                        {user.fullName[0]}
                                    </div>
                                    <div>
                                        <div className='text-truncate'>{user.email}</div>
                                        <div className='text-truncate'>{user.fullName}</div>
                                    </div>
                                </li>)
                        }
                    </ul>
                </div>
                <Columns board={data} />
                
            </div>
}

export default Board;