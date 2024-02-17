import { useActions } from '@/hooks/useActions';
import { useGetByIdsQuery } from '@/store/api/user.api';
import { IUserResponse } from '@/types/user.interface';
import React, { useEffect } from 'react';
import { Toast as bootstrapToast } from 'bootstrap';

interface UsersListProps {
    userIds: number[]
    setUserIds: Function
}

function UsersList({ userIds, setUserIds }: UsersListProps) {
    const { isLoading, isError, data } = useGetByIdsQuery(userIds);
    const { setToastChildren } = useActions();

    useEffect(() => {
        if (isError) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Request error")
            myToast.show()
        }
    }, [isLoading])

    const deleteUser = (id: number) => {
        const index = userIds.findIndex(el => el === id)
        if (index !== undefined)
            setUserIds(userIds.slice(0, index).concat(userIds.slice(index + 1)))
    }

    return (
        <ul className='list-group add-board-users'>
            {
                data && 'length' in data && data.map(user =>
                    <li className='list-group-item d-flex justify-content-between' key={user.id}>
                        <div className="d-flex flex-column">
                            <div>{user.email}</div>
                            <div>{user.fullName}</div>
                        </div>
                        <button className='btn btn-danger' onClick={() => deleteUser(user.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                            </svg>
                        </button>
                    </li>)
            }
        </ul>
    );
}

export default UsersList;