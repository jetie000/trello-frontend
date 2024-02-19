import { IBoard } from '@/types/board.interface';
import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import { Toast as bootstrapToast } from 'bootstrap';
import { Modal as bootstrapModal } from 'bootstrap';
import Tasks from './Tasks';
import Modal from '@/components/modal/Modal';
import { useChangeColumnMutation, useDeleteColumnMutation } from '@/store/api/column.api';
import { IColumn } from '@/types/column.interface';
import { useActions } from '@/hooks/useActions';
import { useAddTaskMutation } from '@/store/api/task.api';
import TaskAdd from './TaskAdd';
import { ITask } from '@/types/task.interface';
import TaskChangeDelete from './TaskChangeDelete';


function Columns({ board }: { board: IBoard }) {

    const { setToastChildren } = useActions();
    const changeColumnRef = useRef<HTMLInputElement>(null)
    const [changeColumn, { isSuccess: isSuccessChange, isError: isErrorChange, isLoading: isLoadingChange }] = useChangeColumnMutation()
    const [deleteColumn, { isSuccess: isSuccessDelete, isError: isErrorDelete, isLoading: isLoadingDelete }] = useDeleteColumnMutation()
    const columnsSorted = useMemo(() => board.columns && board.columns.slice().sort(c => c.order), [board.columns])
    const [currentColumn, setCurrentColumn] = useState<IColumn>()
    const [currentTask, setCurrentTask] = useState<ITask>()

    const addColumnClick = () => {
        if (changeColumnRef.current &&
            changeColumnRef.current.value !== '' &&
            currentColumn) {
            changeColumn({
                id: currentColumn.id,
                name: changeColumnRef.current.value,
                order: currentColumn.order
            })
        }
    }
    

    React.useEffect(() => {
        if (isSuccessDelete) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('deleteColumn') || 'deleteColumn');
            myModal.hide();
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Column deleted successfully")
            myToast.show()
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Error in column deleting")
            myToast.show()
        }
    }, [isLoadingDelete])

    React.useEffect(() => {
        if (isSuccessChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Column changed successfully")
            myToast.show()
        }
        if (isErrorChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Error in column changing")
            myToast.show()
        }
    }, [isLoadingChange])

    return (
        <div className='d-flex p-3 border rounded-2 board-columns flex-fill min-w-0 overflow-x-auto'>
            <div className='d-flex gap-2 flex-fill'>
                {
                    columnsSorted && columnsSorted?.map(c =>
                        <div className='border rounded-2 p-2' key={c.id}>
                            <h5 className='m-0 mb-2 text-truncate'>{c.name}</h5>
                            <div className='d-flex gap-2'>
                                <button onClick={() => setCurrentColumn(c)} className='btn btn-primary flex-fill'
                                    data-bs-toggle="modal" data-bs-target="#changeColumn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                    </svg>
                                </button>
                                <button onClick={() => setCurrentColumn(c)} className='btn btn-danger flex-fill'
                                    data-bs-toggle="modal" data-bs-target="#deleteColumn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                    </svg>
                                </button>
                            </div>
                            <hr className='mt-2 mb-2' />
                            <Tasks column={c} setCurrentColumn={setCurrentColumn} setCurrentTask={setCurrentTask} />
                        </div>)
                }
                <button className='btn btn-primary border rounded-2' data-bs-toggle="modal" data-bs-target="#addColumn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                </button>
            </div>
            <Modal title='Change Column' id='changeColumn' size='sm'>
                <div className="d-flex flex-column">
                    <label htmlFor="inputColumnName">Name</label>
                    <input className="form-control mb-2" id="inputColumnName"
                        placeholder="Enter column name" ref={changeColumnRef} defaultValue={currentColumn?.name} />
                    <button className='btn btn-primary' onClick={addColumnClick}>
                        Change column
                    </button>
                </div>
            </Modal>
            <Modal id='deleteColumn' title='Delete column' size='sm'>
                <div className='d-flex flex-column gap-2'>
                    <div>
                        Are you sure you want delete this column?
                        You will lost all tasks dedicated to this column.
                    </div>
                    <button className='btn btn-danger' onClick={() => deleteColumn(currentColumn?.id || 0)}>
                        Delete column
                    </button>
                </div>
            </Modal>
            <Modal id='addTask' title='Add task' size='md'>
                <TaskAdd column={currentColumn} />
            </Modal>
            <Modal id='changeTask' title='Change task' size='md'>
                <TaskChangeDelete task={currentTask} />
            </Modal>

        </div>
    );
}

export default Columns;