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
import UsersList from '../../components/usersList/UsersList';
import { useAddBoardMutation } from '@/store/api/board.api';

function AddBoard() {
    const { token, id } = useSelector((state: RootState) => state.user);

    if (!token) {
        return <Navigate to={'/login'} />;
    }
    const { setToastChildren } = useActions();


    const [userIds, setUserIds] = useState<number[]>([])
    const nameRef = useRef<HTMLInputElement>(null)
    const descRef = useRef<HTMLTextAreaElement>(null)

    const [addBoard, { isLoading: isLoadingAdd, isError: isErrorAdd, data: dataAdd, isSuccess: isSuccessAdd }] = useAddBoardMutation();


    useEffect(() => {
        if (isErrorAdd) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Request error")
            myToast.show()
        }
        if (isSuccessAdd) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Board succesfully added")
            myToast.show()
        }
    }, [isLoadingAdd])

    const addBoardClick = () => {
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        if (nameRef.current && descRef.current && id &&
            nameRef.current?.value.trim() !== '') {
            addBoard({
                name: nameRef.current.value,
                description: descRef.current.value,
                creatorId: id,
                userIds
            })
        }
        else {
            setToastChildren("Enter data")
            myToast.show()
        }
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
                        placeholder='Enter name' ref={nameRef} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputDescription">Description (Optional)</label>
                    <textarea className="form-control" id="inputDescription"
                        placeholder='Enter description' ref={descRef} />
                </div>
                <UsersList userIds={userIds} setUserIds={setUserIds} />
                
                <button type="button"
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => addBoardClick()}>
                    {
                        isLoadingAdd ?
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> :
                            'Add board'

                    }
                </button>

            </div>
        </div>
    );
}

export default AddBoard;