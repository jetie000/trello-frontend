import * as React from 'react';
import UsersList from '../../components/usersList/UsersList';
import { useActions } from '@/hooks/useActions';
import { useEffect, useRef, useState } from 'react';
import { Toast as bootstrapToast } from 'bootstrap';
import { useSearchUsersQuery } from '@/store/api/user.api';
import { IBoard } from '@/types/board.interface';
import { useChangeBoardMutation } from '@/store/api/board.api';
import { IUserResponse } from '@/types/user.interface';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { variables } from '@/variables';

function BoardChange({ board }: { board: IBoard }) {

    const { setToastChildren } = useActions();

    const { language } = useSelector((state: RootState) => state.options);
    const [userIds, setUserIds] = useState<number[]>(board.users?.map(u => u.id) || [])
    const nameRef = useRef<HTMLInputElement>(null)
    const descRef = useRef<HTMLTextAreaElement>(null)

    const [changeBoard, { isLoading: isLoadingChange, isError: isErrorChange, data: dataChange, isSuccess: isSuccessChange }] = useChangeBoardMutation();

    useEffect(() => {
        if (isErrorChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_REQUEST)
            myToast.show()
        }
        if (isSuccessChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].BOARD_CHANGED)
            myToast.show()
        }
    }, [isLoadingChange])

    const changeBoardClick = () => {
        const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
        if (nameRef.current && descRef.current &&
            nameRef.current?.value.trim() !== '') {
            changeBoard({
                name: nameRef.current.value,
                description: descRef.current.value,
                id: board.id,
                userIds
            })
        }
        else {
            setToastChildren(variables.LANGUAGES[language].INPUT_DATA)
            myToast.show()
        }
    }

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="inputBoardName">{variables.LANGUAGES[language].NAME}</label>
                <input className="form-control" id="inputBoardName"
                    placeholder={variables.LANGUAGES[language].ENTER_NAME} ref={nameRef} defaultValue={board.name} />
            </div>
            <div className="mb-3">
                <label htmlFor="inputBoardDescription">{variables.LANGUAGES[language].DESCRIPTION}</label>
                <textarea className="form-control" id="inputBoardDescription"
                    placeholder={variables.LANGUAGES[language].ENTER_DESCRIPTION} ref={descRef} defaultValue={board.description} />
            </div>
            <UsersList userIds={userIds} setUserIds={setUserIds} />
            <button type="button"
                className="btn btn-primary w-100 mt-3"
                onClick={() => changeBoardClick()}>
                {
                    isLoadingChange ?
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                        </div> :
                        variables.LANGUAGES[language].CHANGE_BOARD

                }
            </button>
        </div>
    );
}

export default BoardChange;