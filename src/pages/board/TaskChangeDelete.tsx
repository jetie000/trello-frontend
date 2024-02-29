import { useActions } from "@/hooks/useActions"
import { useChangeTaskMutation, useDeleteTaskMutation } from "@/store/api/task.api"
import { ITask } from "@/types/task.interface"
import { useEffect, useRef, useState } from "react"
import { Modal } from "bootstrap"
import UsersList from "@/components/usersList/UsersList"
import ModalWrapper from "@/components/modalWrapper/ModalWrapper"
import { useParams } from "react-router-dom"
import { RootStateStore } from "@/store/store"
import { useSelector } from "react-redux"
import { languages } from "@/config/languages"

function TaskChangeDelete({ task }: { task: ITask | undefined }) {
  const { id } = useParams()
  const { language } = useSelector((state: RootStateStore) => state.options)
  const { showToast } = useActions()
  const modalRefDelete = useRef<HTMLDivElement>(null)
  const changeTaskNameRef = useRef<HTMLInputElement>(null)
  const changeTaskDescRef = useRef<HTMLTextAreaElement>(null)
  const modalRefChange = useRef<HTMLDivElement>(null)
  const [
    changeTask,
    { isSuccess: isSuccessChange, isError: isErrorChange, isLoading: isLoadingChange }
  ] = useChangeTaskMutation()
  const [
    deleteTask,
    { isSuccess: isSuccessDelete, isError: isErrorDelete, isLoading: isLoadingDelete }
  ] = useDeleteTaskMutation()
  const [userIds, setUserIds] = useState<number[]>([])

  useEffect(() => {
    if (task?.users.length) {
      setUserIds(task.users.map(u => u.id))
    }
  }, [task?.users])

  const changeTaskClick = () => {
    if (
      changeTaskNameRef.current &&
      changeTaskDescRef.current &&
      changeTaskNameRef.current.value !== "" &&
      task
    ) {
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
    if (modalRefDelete.current) {
      const myModal = Modal.getOrCreateInstance("#" + modalRefDelete.current?.id)
      myModal.show()
    }
  }

  useEffect(() => {
    if (isSuccessChange) {
      showToast(languages[language].TASK_CHANGED)
    }
    if (isErrorChange) {
      showToast(languages[language].ERROR_REQUEST)
    }
  }, [isLoadingChange])

  useEffect(() => {
    if (isSuccessDelete) {
      if (modalRefDelete.current) {
        const myModal = Modal.getOrCreateInstance("#" + modalRefDelete.current?.id)
        myModal.hide()
      }
      if (modalRefChange.current) {
        const myModal = Modal.getOrCreateInstance("#" + modalRefChange.current?.id)
        myModal.hide()
      }
      showToast(languages[language].TASK_DELETED)
    }
    if (isErrorDelete) {
      showToast(languages[language].ERROR_REQUEST)
    }
  }, [isLoadingDelete])

  return (
    <ModalWrapper
      id="changeTask"
      title={languages[language].CHANGE_TASK}
      size="md"
      ref={modalRefChange}
    >
      <div className="d-flex flex-column">
        <label htmlFor="inputTaskNameChange">{languages[language].NAME}</label>
        <input
          className="form-control mb-2"
          id="inputTaskNameChange"
          placeholder={languages[language].ENTER_NAME}
          ref={changeTaskNameRef}
          defaultValue={task?.name}
        />
        <label htmlFor="inputTaskDescChange">{languages[language].DESCRIPTION}</label>
        <textarea
          className="form-control mb-2"
          id="inputTaskDescChange"
          placeholder={languages[language].ENTER_DESCRIPTION}
          ref={changeTaskDescRef}
          defaultValue={task?.description}
        />
        <UsersList userIds={userIds} setUserIds={setUserIds} boardId={Number(id)} />
        <button className="btn btn-primary mt-2 mb-2" onClick={changeTaskClick}>
          {languages[language].CHANGE_TASK}
        </button>
        <button className="btn btn-danger" onClick={deleteTaskClick}>
          {languages[language].DELETE_TASK}
        </button>
        <ModalWrapper
          id="deleteTask"
          title={languages[language].DELETE_TASK}
          size="sm"
          ref={modalRefDelete}
        >
          <div className="d-flex flex-column gap-2">
            <div>{languages[language].SURE_DELETE_TASK}</div>
            <button
              className="btn btn-danger"
              onClick={() => deleteTask({ taskId: task?.id || 0, boardId: Number(id) || 0 })}
            >
              {languages[language].DELETE_TASK}
            </button>
          </div>
        </ModalWrapper>
      </div>
    </ModalWrapper>
  )
}

export default TaskChangeDelete
