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
  const { setToastChildren } = useActions()
  const { language } = useSelector((state: RootState) => state.options)

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
      const myModal = bootstrapModal.getOrCreateInstance(
        document.getElementById("deleteColumn") || "deleteColumn"
      )
      myModal.hide()
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].COLUMN_DELETED)
      myToast.show()
    }
    if (isErrorDelete) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].ERROR_REQUEST)
      myToast.show()
    }
  }, [isLoadingDelete])

  React.useEffect(() => {
    if (isSuccessChange) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].COLUMN_CHANGED)
      myToast.show()
    }
    if (isErrorChange) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].ERROR_REQUEST)
      myToast.show()
    }
  }, [isLoadingChange])

  return (
    <>
      <Modal title={variables.LANGUAGES[language].CHANGE_COLUMN} id="changeColumn" size="sm">
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
      <Modal id="deleteColumn" title={variables.LANGUAGES[language].DELETE_COLUMN} size="sm">
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
