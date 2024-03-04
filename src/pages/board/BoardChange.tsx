import UsersList from "../../components/usersList/UsersList"
import { useActions } from "@/hooks/useActions"
import { useEffect, useRef, useState } from "react"
import { IBoard } from "@/types/board.interface"
import { useChangeBoardMutation } from "@/store/api/board.api"
import { RootStateStore } from "@/store/store"
import { useSelector } from "react-redux"
import { languages } from "@/config/languages"

function BoardChange({ board }: { board: IBoard }) {
  const { showToast } = useActions()

  const { language } = useSelector((state: RootStateStore) => state.options)
  const [userIds, setUserIds] = useState<number[]>(board.users?.map(u => u.id) || [])
  const nameRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  const [
    changeBoard,
    { isLoading: isLoadingChange, isError: isErrorChange, isSuccess: isSuccessChange }
  ] = useChangeBoardMutation()

  useEffect(() => {
    if (isErrorChange) {
      showToast(languages[language].ERROR_REQUEST)
    }
    if (isSuccessChange) {
      showToast(languages[language].BOARD_CHANGED)
    }
  }, [isLoadingChange])

  const changeBoardClick = () => {
    if (nameRef.current && descRef.current && nameRef.current?.value.trim() !== "") {
      changeBoard({
        name: nameRef.current.value,
        description: descRef.current.value,
        id: board.id,
        userIds
      })
    } else {
      showToast(languages[language].INPUT_DATA)
    }
  }

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="inputBoardName">{languages[language].NAME}</label>
        <input
          className="form-control"
          id="inputBoardName"
          placeholder={languages[language].ENTER_NAME}
          ref={nameRef}
          defaultValue={board.name}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inputBoardDescription">{languages[language].DESCRIPTION}</label>
        <textarea
          className="form-control"
          id="inputBoardDescription"
          placeholder={languages[language].ENTER_DESCRIPTION}
          ref={descRef}
          defaultValue={board.description}
        />
      </div>
      <UsersList userIds={userIds} setUserIds={setUserIds} />
      <button
        type="button"
        className="btn btn-primary w-100 mt-3"
        onClick={changeBoardClick}
        data-testid="change-board-btn"
      >
        {isLoadingChange ? (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">{languages[language].LOADING}</span>
          </div>
        ) : (
          languages[language].CHANGE_BOARD
        )}
      </button>
    </div>
  )
}

export default BoardChange
