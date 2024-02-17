import { useGetBoardByUserIdQuery } from '@/store/api/board.api';
import { RootState } from '@/store/store';
import { IBoard } from '@/types/board.interface';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import './MyBoards.scss'
import { useGetByIdsQuery } from '@/store/api/user.api';

function MyBoards() {
    const { token, id } = useSelector((state: RootState) => state.user);

    if (!token) {
        return <Navigate to={'/login'} />;
    }

    const navigate = useNavigate()
    const { isLoading, isError, data } = useGetBoardByUserIdQuery(id || 0);

    return (
        <div className='d-flex flex-fill flex-column'>
            <h2 className='text-center p-3'>
                My boards
            </h2>
            <div className="d-flex flex-column gap-2 my-boards-list">
                {
                    isLoading && <div className="spinner-border ms-auto me-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }
                {
                    data && (data as IBoard[]).map(board =>
                        <div className='d-flex justify-content-between border rounded-2 p-3 w-100 cursor-pointer gap-2'
                            key={board.id}
                            onClick={() => navigate('/board/' + board.id)}>
                            <h3 className='m-0'>{board.name}</h3>
                            <h5 className='m-0'>
                                {board.users && 'Creator: ' + board.users?.find(user => user.id === board.creatorId)?.fullName}
                            </h5>
                        </div>)
                }
            </div>
        </div>
    );
}

export default MyBoards;