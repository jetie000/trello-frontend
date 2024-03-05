import "./AddBoard.scss"
import { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootStateStore } from "@/store/store"
import { useActions } from "@/hooks/useActions"
import UsersList from "../../components/usersList/UsersList"
import { useAddBoardMutation } from "@/store/api/board.api"
import { languages } from "@/config/languages"

function AddBoard() {
  const { token, id } = useSelector((state: RootStateStore) => state.user)

  if (!token) {
    return <Navigate to={"/login"} />
  }
  const { showToast } = useActions()

  const { language } = useSelector((state: RootStateStore) => state.options)
  const [userIds, setUserIds] = useState<number[]>([])
  const nameRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  const [
    addBoard,
    { isLoading: isLoadingAdd, isError: isErrorAdd, data: dataAdd, isSuccess: isSuccessAdd }
  ] = useAddBoardMutation()

  useEffect(() => {
    if (isErrorAdd) {
      showToast(languages[language].ERROR_REQUEST)
    }
    if (isSuccessAdd && nameRef.current && descRef.current) {
      showToast(languages[language].BOARD_ADDED)
      nameRef.current.value = ""
      descRef.current.value = ""
      setUserIds([])
    }
  }, [isLoadingAdd])

  const addBoardClick = () => {
    if (nameRef.current && descRef.current && id && nameRef.current?.value.trim() !== "") {
      addBoard({
        name: nameRef.current.value,
        description: descRef.current.value,
        creatorId: id,
        userIds
      })
    } else {
      showToast(languages[language].INPUT_DATA)
    }
  }

  return (
    <div className=" d-flex flex-fill flex-column">
      <div className="ms-auto me-auto d-flex flex-column add-board ps-3 pe-3 flex-fill">
        <h2 className="text-center p-3">{languages[language].ADD_BOARD}</h2>
        <div className="mb-3">
          <label htmlFor="inputName">{languages[language].NAME}</label>
          <input
            className="form-control"
            id="inputName"
            placeholder={languages[language].ENTER_NAME}
            ref={nameRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputDescription">{languages[language].DESCRIPTION}</label>
          <textarea
            className="form-control"
            id="inputDescription"
            placeholder={languages[language].ENTER_DESCRIPTION}
            ref={descRef}
          />
        </div>
        <UsersList userIds={userIds} setUserIds={setUserIds} />

        <button type="button" className="btn btn-primary w-100 mt-3" onClick={addBoardClick}>
          {isLoadingAdd ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">{languages[language].LOADING}</span>
            </div>
          ) : (
            languages[language].ADD_BOARD
          )}
        </button>
      </div>
    </div>
  )
}

export default AddBoard
