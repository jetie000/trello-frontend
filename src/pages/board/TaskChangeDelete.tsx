import { useActions } from '@/hooks/useActions';
import { useChangeTaskMutation, useDeleteTaskMutation } from '@/store/api/task.api';
import { ITask } from '@/types/task.interface';
import * as React from 'react';
import { useRef, useState } from 'react';
import { Toast as bootstrapToast } from 'bootstrap';
import { Modal as bootstrapModal } from 'bootstrap';
import UsersList from '@/components/usersList/UsersList';
import Modal from '@/components/modal/Modal';
import { useParams } from 'react-router-dom';


function TaskChangeDelete({ task }: { task: ITask | undefined }) {
    const { id } = useParams()
    const { setToastChildren } = useActions();
    const changeTaskNameRef = useRef<HTMLInputElement>(null)
    const changeTaskDescRef = useRef<HTMLTextAreaElement>(null)
    const [changeTask, { isSuccess: isSuccessChange, isError: isErrorChange, isLoading: isLoadingChange }] = useChangeTaskMutation()
    const [deleteTask, { isSuccess: isSuccessDelete, isError: isErrorDelete, isLoading: isLoadingDelete }] = useDeleteTaskMutation()
    const [userIds, setUserIds] = useState<number[]>([])

    React.useEffect(() => {
        if (task?.users.length) {
            setUserIds(task.users.map(u => u.id))
        }
    }, [task?.users])

    const changeTaskClick = () => {
        if (changeTaskNameRef.current && changeTaskDescRef.current &&
            changeTaskNameRef.current.value !== '' && task) {
            changeTask({
                id: task.id,
                name: changeTaskNameRef.current.value,
                description: changeTaskDescRef.current.value,
                userIds,
                columnId: task.columnId
            })
        }
    }

    const deleteTaskClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('deleteTask') || 'deleteTask');
        myModal.show();
    }

    React.useEffect(() => {
        if (isSuccessChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Task changed successfully")
            myToast.show()
        }
        if (isErrorChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Error in task changing")
            myToast.show()
        }
    }, [isLoadingChange])

    React.useEffect(() => {
        if (isSuccessDelete) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('deleteTask') || 'deleteTask');
            myModal.hide();
            const myModal2 = bootstrapModal.getOrCreateInstance(document.getElementById('changeTask') || 'changeTask');
            myModal2.hide();
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Task deleted successfully")
            myToast.show()
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Error in task deleting")
            myToast.show()
        }
    }, [isLoadingDelete])

    return (
        <div className="d-flex flex-column">
            <label htmlFor="inputTaskName">Name</label>
            <input className="form-control mb-2" id="inputTaskName"
                placeholder="Enter task name" ref={changeTaskNameRef} defaultValue={task?.name} />
            <label htmlFor="inputTaskDesc">Description (Optional)</label>
            <textarea className="form-control mb-2" id="inputDescName"
                placeholder="Enter task description" ref={changeTaskDescRef} defaultValue={task?.description} />
            <UsersList userIds={userIds} setUserIds={setUserIds} boardId={Number(id)}/>
            <button className='btn btn-primary mt-2 mb-2' onClick={changeTaskClick}>
                Change task
            </button>
            <button className='btn btn-danger' onClick={() => deleteTaskClick()}>
                Delete task
            </button>
            <Modal id='deleteTask' title='Delete task' size='sm'>
                <div className='d-flex flex-column gap-2'>
                    <div>
                        Are you sure you want delete this task?
                    </div>
                    <button className='btn btn-danger' onClick={() => deleteTask({ taskId: task?.id || 0, boardId: Number(id) || 0 })}>
                        Delete task
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default TaskChangeDelete;