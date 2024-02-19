import UsersList from '@/components/usersList/UsersList';
import { useAddTaskMutation } from '@/store/api/task.api';
import { IColumn } from '@/types/column.interface';
import * as React from 'react';
import { useRef, useState } from 'react';
import { Toast as bootstrapToast } from 'bootstrap';
import { Modal as bootstrapModal } from 'bootstrap';
import { useActions } from '@/hooks/useActions';

function TaskAdd({column}:{column: IColumn | undefined}) {
    const { setToastChildren } = useActions();
    const addTaskNameRef = useRef<HTMLInputElement>(null)
    const addTaskDescRef = useRef<HTMLTextAreaElement>(null)
    const [addTask, { isSuccess: isSuccessAdd, isError: isErrorAdd, isLoading: isLoadingAdd }] = useAddTaskMutation()
    const [userIds, setUserIds] = useState<number[]>([])
    
    const addTaskClick = () => {
        if (addTaskNameRef.current &&
            addTaskNameRef.current.value !== '' && column) {
            addTask({
                columnId: column.id,
                name: addTaskNameRef.current.value,
                description: addTaskDescRef.current?.value,
                userIds: userIds
            })
        }
    }

    React.useEffect(() => {
        if (isSuccessAdd) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addTask') || 'addTask');
            myModal.hide();
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Task added successfully")
            myToast.show()
        }
        if (isErrorAdd) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Error in task adding")
            myToast.show()
        }
    }, [isLoadingAdd])

    return (
        <div className="d-flex flex-column">
            <label htmlFor="inputTaskName">Name</label>
            <input className="form-control mb-2" id="inputTaskName"
                placeholder="Enter task name" ref={addTaskNameRef} />
            <label htmlFor="inputTaskDesc">Description (Optional)</label>
            <textarea className="form-control mb-2" id="inputTaskDesc"
                placeholder="Enter task description" ref={addTaskDescRef} />
            <UsersList userIds={userIds} setUserIds={setUserIds} boardId={column?.boardId}/>
            <button className='btn btn-primary mt-2' onClick={addTaskClick}>
                Add task
            </button>
        </div>
    );
}

export default TaskAdd;