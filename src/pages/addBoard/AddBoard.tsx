import * as React from 'react';
import './AddBoard.scss'
import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Toast as bootstrapToast } from 'bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useSearchUsersQuery } from '@/store/api/user.api';
import { IUserResponse } from '@/types/user.interface';
import { variables } from '@/variables';
import { useActions } from '@/hooks/useActions';

function AddBoard() {
    const { token, id } = useSelector((state: RootState) => state.user);

    if (!token) {
        return <Navigate to={'/login'} />;
    }
    const inputSearch = useRef<HTMLInputElement>(null);
    const [searchStr, setSearchStr] = useState('');
    const [isShow, setIsShow] = useState(false);
    const { setToastChildren } = useActions();

    const { isLoading, isError, data: dataSearch } = useSearchUsersQuery(searchStr, {skip: searchStr === ''});

    useEffect(() => {
        if (isError) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Request error")
            myToast.show()
        }
    }, [isLoading])

    const addBoardClick = () => {

    }

    const addUserClick = (user: IUserResponse) => {

    }

    return (
        <div className=' d-flex flex-fill flex-column'>
            <div className='ms-auto me-auto d-flex flex-column add-board ps-3 pe-3 flex-fill'>
                <h2 className='text-center p-3'>
                    Add Board
                </h2>
                <div className="mb-3">
                    <label htmlFor="inputName">Name</label>
                    <input className="form-control" id="inputName"
                        placeholder='Enter name' />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputDescription">Description (Optional)</label>
                    <textarea className="form-control" id="inputDescription"
                        placeholder='Enter description' />
                </div>
                <div className="input-group mb-1">
                    <input type="text"
                        className="form-control w-50"
                        placeholder="Enter request"
                        ref={inputSearch}
                        onChange={(e) => setSearchStr(e.target.value)}
                        onFocus={() => setIsShow(true)} />
                    <button className="btn btn-secondary d-flex align-items-center"
                        type="button"
                        onClick={() => {
                            inputSearch.current!.value = ''
                            setSearchStr('')
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                    </button>
                </div>

                {isShow &&
                    <div className="position-relative">
                        <ul onClick={() => setIsShow(false)} id='searchList' className="list-group user-search-list position-absolute">
                            {dataSearch && searchStr !== '' && (dataSearch as IUserResponse[]).length > 0 && (dataSearch as IUserResponse[]).map(user =>
                                <li
                                    onClick={() => addUserClick(user)}
                                    className='list-group-item p-2 cursor-pointer text-truncate'
                                    key={user.email}>
                                    <div>{user.email}</div>
                                    <div>{user.fullName}</div>
                                </li>)
                            }
                        </ul>
                    </div>
                }
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => addBoardClick()}>
                    Add board
                </button>

            </div>
        </div>
    );
}

export default AddBoard;