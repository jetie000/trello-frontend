import { useAddColumnMutation } from "@/store/api/column.api"
import { Modal as bootstrapModal } from "bootstrap"
import { useActions } from "@/hooks/useActions"
import { RootStateStore } from "@/store/store"
import { useSelector } from "react-redux"
import { languages } from "@/config/languages"
import ModalWrapper from "@/components/modalWrapper/ModalWrapper"
import { useEffect, useRef } from "react"

function ColumnAdd({ boardId }: { boardId: number | undefined }) {
  const modalRefAdd = useRef<HTMLDivElement>(null)
  const addColumnRef = useRef<HTMLInputElement>(null)
  const [addColumn, { isSuccess: isSuccessAdd, isError: isErrorAdd, isLoading: isLoadingAdd }] =
    useAddColumnMutation()
  const { showToast } = useActions()
  const { language } = useSelector((state: RootStateStore) => state.options)

  useEffect(() => {
    if (isSuccessAdd) {
      if (modalRefAdd.current) {
        const myModal = bootstrapModal.getOrCreateInstance("#" + modalRefAdd.current?.id)
        myModal.hide()
      }
      showToast(languages[language].COLUMN_ADDED)
    }
    if (isErrorAdd) {
      showToast(languages[language].ERROR_REQUEST)
    }
  }, [isLoadingAdd])

  const addColumnClick = () => {
    if (addColumnRef.current && addColumnRef.current.value !== "" && boardId) {
      addColumn({
        boardId,
        name: addColumnRef.current.value
      })
      return
    }
    showToast(languages[language].INPUT_DATA)
  }

  return (
    <ModalWrapper id="addColumn" title={languages[language].ADD_COLUMN} size="sm" ref={modalRefAdd}>
      <div className="d-flex flex-column">
        <label htmlFor="inputColumnName">{languages[language].NAME}</label>
        <input
          className="form-control mb-2"
          id="inputColumnName"
          placeholder={languages[language].ENTER_NAME}
          ref={addColumnRef}
        />
        <button className="btn btn-primary" onClick={addColumnClick} data-testid="add-column-btn">
          {languages[language].ADD_COLUMN}
        </button>
      </div>
    </ModalWrapper>
  )
}

export default ColumnAdd
