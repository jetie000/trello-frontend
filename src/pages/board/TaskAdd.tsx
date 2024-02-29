import UsersList from "@/components/usersList/UsersList"
import { useAddTaskMutation } from "@/store/api/task.api"
import { IColumn } from "@/types/column.interface"
import { useEffect, useRef, useState } from "react"
import { Modal } from "bootstrap"
import { useActions } from "@/hooks/useActions"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { variables } from "@/variables"
import ModalWrapper from "@/components/modalWrapper/ModalWrapper"

function TaskAdd({ column }: { column: IColumn | undefined }) {
  const { showToast } = useActions()
  const { language } = useSelector((state: RootState) => state.options)

  const modalRefAdd = useRef<HTMLDivElement>(null)
  const addTaskNameRef = useRef<HTMLInputElement>(null)
  const addTaskDescRef = useRef<HTMLTextAreaElement>(null)
  const [addTask, { isSuccess: isSuccessAdd, isError: isErrorAdd, isLoading: isLoadingAdd }] =
    useAddTaskMutation()
  const [userIds, setUserIds] = useState<number[]>([])

  const addTaskClick = () => {
    if (addTaskNameRef.current && addTaskNameRef.current.value !== "" && column) {
      addTask({
        columnId: column.id,
        name: addTaskNameRef.current.value,
        description: addTaskDescRef.current?.value,
        userIds: userIds
      })
    }
  }

  useEffect(() => {
    if (isSuccessAdd) {
      if (modalRefAdd.current) {
        const myModal = Modal.getOrCreateInstance("#" + modalRefAdd.current?.id)
        myModal.hide()
      }
      showToast(variables.LANGUAGES[language].TASK_ADDED)
    }
    if (isErrorAdd) {
      showToast(variables.LANGUAGES[language].ERROR_REQUEST)
    }
  }, [isLoadingAdd])

  return (
    <ModalWrapper
      id="addTask"
      title={variables.LANGUAGES[language].ADD_TASK}
      size="md"
      ref={modalRefAdd}
    >
      <div className="d-flex flex-column">
        <label htmlFor="inputTaskName">{variables.LANGUAGES[language].NAME}</label>
        <input
          className="form-control mb-2"
          id="inputTaskName"
          placeholder={variables.LANGUAGES[language].ENTER_NAME}
          ref={addTaskNameRef}
        />
        <label htmlFor="inputTaskDesc">{variables.LANGUAGES[language].DESCRIPTION}</label>
        <textarea
          className="form-control mb-2"
          id="inputTaskDesc"
          placeholder={variables.LANGUAGES[language].ENTER_DESCRIPTION}
          ref={addTaskDescRef}
        />
        <UsersList userIds={userIds} setUserIds={setUserIds} boardId={column?.boardId} />
        <button className="btn btn-primary mt-2" onClick={addTaskClick}>
          {variables.LANGUAGES[language].ADD_TASK}
        </button>
      </div>
    </ModalWrapper>
  )
}

export default TaskAdd
