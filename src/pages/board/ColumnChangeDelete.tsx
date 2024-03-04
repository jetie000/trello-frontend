import ModalWrapper from "@/components/modalWrapper/ModalWrapper"
import { useChangeColumnMutation, useDeleteColumnMutation } from "@/store/api/column.api"
import { IColumn } from "@/types/column.interface"
import { useEffect, useRef } from "react"
import { Modal } from "bootstrap"
import { useActions } from "@/hooks/useActions"
import { languages } from "@/config/languages"
import { useSelector } from "react-redux"
import { RootStateStore } from "@/store/store"

function ColumnChangeDelete({ currentColumn }: { currentColumn: IColumn | undefined }) {
  const { showToast } = useActions()
  const { language } = useSelector((state: RootStateStore) => state.options)
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

  const changeColumnClick = () => {
    if (changeColumnRef.current && changeColumnRef.current.value !== "" && currentColumn) {
      changeColumn({
        id: currentColumn.id,
        name: changeColumnRef.current.value,
        order: currentColumn.order
      })
      return
    }
    showToast(languages[language].INPUT_DATA)
  }

  useEffect(() => {
    if (isSuccessDelete) {
      if (modalRefDelete.current) {
        const myModal = Modal.getOrCreateInstance("#" + modalRefDelete.current?.id)
        myModal.hide()
      }
      showToast(languages[language].COLUMN_DELETED)
    }
    if (isErrorDelete) {
      showToast(languages[language].ERROR_REQUEST)
    }
  }, [isLoadingDelete])

  useEffect(() => {
    if (isSuccessChange) {
      showToast(languages[language].COLUMN_CHANGED)
    }
    if (isErrorChange) {
      showToast(languages[language].ERROR_REQUEST)
    }
  }, [isLoadingChange])

  return (
    <>
      <ModalWrapper
        title={languages[language].CHANGE_COLUMN}
        id="changeColumn"
        size="sm"
        ref={modalRefChange}
      >
        <div className="d-flex flex-column">
          <label htmlFor="inputColumnNameChange">{languages[language].NAME}</label>
          <input
            className="form-control mb-2"
            id="inputColumnNameChange"
            placeholder={languages[language].ENTER_NAME}
            ref={changeColumnRef}
            defaultValue={currentColumn?.name}
          />
          <button
            className="btn btn-primary"
            onClick={changeColumnClick}
            data-testid="change-column-btn"
          >
            {languages[language].CHANGE_COLUMN}
          </button>
        </div>
      </ModalWrapper>
      <ModalWrapper
        id="deleteColumn"
        title={languages[language].DELETE_COLUMN}
        size="sm"
        ref={modalRefDelete}
      >
        <div className="d-flex flex-column gap-2">
          <div>{languages[language].SURE_DELETE_COLUMN}</div>
          <button
            className="btn btn-danger"
            onClick={() => deleteColumn(currentColumn?.id || 0)}
            data-testid="delete-column-btn"
          >
            {languages[language].DELETE_COLUMN}
          </button>
        </div>
      </ModalWrapper>
    </>
  )
}

export default ColumnChangeDelete
