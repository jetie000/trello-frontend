import { useAddColumnMutation } from "@/store/api/column.api"
import { IBoard } from "@/types/board.interface"
import * as React from "react"
import { Modal as bootstrapModal } from "bootstrap"
import { useActions } from "@/hooks/useActions"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { variables } from "@/variables"
import Modal from "@/components/modal/Modal"
import { useRef } from "react"

function ColumnAdd({ boardId }: { boardId: number | undefined }) {
  const modalRefAdd = useRef<HTMLDivElement>(null)
  const addColumnRef = React.useRef<HTMLInputElement>(null)
  const [addColumn, { isSuccess: isSuccessAdd, isError: isErrorAdd, isLoading: isLoadingAdd }] =
    useAddColumnMutation()
  const { showToast } = useActions()
  const { language } = useSelector((state: RootState) => state.options)

  React.useEffect(() => {
    if (isSuccessAdd) {
      if (modalRefAdd.current) {
        const myModal = bootstrapModal.getOrCreateInstance("#" + modalRefAdd.current?.id)
        myModal.hide()
      }
      showToast(variables.LANGUAGES[language].COLUMN_ADDED)
    }
    if (isErrorAdd) {
      showToast(variables.LANGUAGES[language].ERROR_REQUEST)
    }
  }, [isLoadingAdd])

  const addColumnClick = () => {
    if (addColumnRef.current && addColumnRef.current.value !== "" && boardId) {
      addColumn({
        boardId,
        name: addColumnRef.current.value
      })
    }
  }

  return (
    <Modal
      id="addColumn"
      title={variables.LANGUAGES[language].ADD_COLUMN}
      size="sm"
      ref={modalRefAdd}
    >
      <div className="d-flex flex-column">
        <label htmlFor="inputColumnName">{variables.LANGUAGES[language].NAME}</label>
        <input
          className="form-control mb-2"
          id="inputColumnName"
          placeholder={variables.LANGUAGES[language].ENTER_NAME}
          ref={addColumnRef}
        />
        <button className="btn btn-primary" onClick={addColumnClick}>
          {variables.LANGUAGES[language].ADD_COLUMN}
        </button>
      </div>
    </Modal>
  )
}

export default ColumnAdd
