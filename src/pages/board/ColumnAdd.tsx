import { useAddColumnMutation } from "@/store/api/column.api"
import { IBoard } from "@/types/board.interface"
import * as React from "react"
import { Toast as bootstrapToast } from "bootstrap"
import { Modal as bootstrapModal } from "bootstrap"
import { useActions } from "@/hooks/useActions"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { variables } from "@/variables"

function ColumnAdd({ board }: { board: IBoard | undefined }) {
  const addColumnRef = React.useRef<HTMLInputElement>(null)
  const [addColumn, { isSuccess: isSuccessAdd, isError: isErrorAdd, isLoading: isLoadingAdd }] =
    useAddColumnMutation()
  const { setToastChildren } = useActions()
  const { language } = useSelector((state: RootState) => state.options)

  React.useEffect(() => {
    if (isSuccessAdd) {
      const myModal = bootstrapModal.getOrCreateInstance(
        document.getElementById("addColumn") || "addColumn"
      )
      myModal.hide()
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].COLUMN_ADDED)
      myToast.show()
    }
    if (isErrorAdd) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].ERROR_REQUEST)
      myToast.show()
    }
  }, [isLoadingAdd])

  const addColumnClick = () => {
    if (addColumnRef.current && addColumnRef.current.value !== "" && board && "id" in board) {
      addColumn({
        boardId: board.id,
        name: addColumnRef.current.value
      })
    }
  }

  return (
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
  )
}

export default ColumnAdd
