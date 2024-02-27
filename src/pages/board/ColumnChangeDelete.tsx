import Modal from "@/components/modal/Modal"
import { useChangeColumnMutation, useDeleteColumnMutation } from "@/store/api/column.api"
import { IColumn } from "@/types/column.interface"
import * as React from "react"
import { useRef } from "react"
import { Toast as bootstrapToast } from "bootstrap"
import { Modal as bootstrapModal } from "bootstrap"
import { useActions } from "@/hooks/useActions"
import { variables } from "@/variables"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

function ColumnChangeDelete({ currentColumn }: { currentColumn: IColumn | undefined }) {
  const { showToast } = useActions()
  const { language } = useSelector((state: RootState) => state.options)
  const modalRefDelete = useRef<HTMLDivElement>(null)
  const modalRefChange = useRef<HTMLDivElement>(null)

  const changeColumnRef = useRef<HTMLInputElement>(null)
  const [
    changeColumn,
    { isSuccess: isSuccessChange, isError: isErrorChange, isLoading: isLoadingChange }
  ] = useChangeColumnMutation()
  const [
    deleteColumn,
    { isSuccess: isSuccessDelete, isError: isErrorDelete, isLoading: isLoadingDelete }
  ] = useDeleteColumnMutation()

  const addColumnClick = () => {
    if (changeColumnRef.current && changeColumnRef.current.value !== "" && currentColumn) {
      changeColumn({
        id: currentColumn.id,
        name: changeColumnRef.current.value,
        order: currentColumn.order
      })
    }
  }

  React.useEffect(() => {
    if (isSuccessDelete) {
      if (modalRefDelete.current) {
        const myModal = bootstrapModal.getOrCreateInstance("#" + modalRefDelete.current?.id)
        myModal.hide()
      }
      showToast(variables.LANGUAGES[language].COLUMN_DELETED)
    }
    if (isErrorDelete) {
      showToast(variables.LANGUAGES[language].ERROR_REQUEST)
    }
  }, [isLoadingDelete])

  React.useEffect(() => {
    if (isSuccessChange) {
      showToast(variables.LANGUAGES[language].COLUMN_CHANGED)
    }
    if (isErrorChange) {
      showToast(variables.LANGUAGES[language].ERROR_REQUEST)
    }
  }, [isLoadingChange])

  return (
    <>
      <Modal
        title={variables.LANGUAGES[language].CHANGE_COLUMN}
        id="changeColumn"
        size="sm"
        ref={modalRefChange}
      >
        <div className="d-flex flex-column">
          <label htmlFor="inputColumnNameChange">{variables.LANGUAGES[language].NAME}</label>
          <input
            className="form-control mb-2"
            id="inputColumnNameChange"
            placeholder={variables.LANGUAGES[language].ENTER_NAME}
            ref={changeColumnRef}
            defaultValue={currentColumn?.name}
          />
          <button className="btn btn-primary" onClick={addColumnClick}>
            {variables.LANGUAGES[language].CHANGE_COLUMN}
          </button>
        </div>
      </Modal>
      <Modal
        id="deleteColumn"
        title={variables.LANGUAGES[language].DELETE_COLUMN}
        size="sm"
        ref={modalRefDelete}
      >
        <div className="d-flex flex-column gap-2">
          <div>{variables.LANGUAGES[language].SURE_DELETE_COLUMN}</div>
          <button className="btn btn-danger" onClick={() => deleteColumn(currentColumn?.id || 0)}>
            {variables.LANGUAGES[language].DELETE_COLUMN}
          </button>
        </div>
      </Modal>
    </>
  )
}

export default ColumnChangeDelete
