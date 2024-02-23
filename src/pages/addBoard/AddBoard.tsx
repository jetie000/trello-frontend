import * as React from "react"
import "./AddBoard.scss"
import { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import { Toast as bootstrapToast } from "bootstrap"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useActions } from "@/hooks/useActions"
import UsersList from "../../components/usersList/UsersList"
import { useAddBoardMutation } from "@/store/api/board.api"
import { variables } from "@/variables"

function AddBoard() {
  const { token, id } = useSelector((state: RootState) => state.user)

  if (!token) {
    return <Navigate to={"/login"} />
  }
  const { setToastChildren } = useActions()

  const { language } = useSelector((state: RootState) => state.options)
  const [userIds, setUserIds] = useState<number[]>([])
  const nameRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  const [
    addBoard,
    { isLoading: isLoadingAdd, isError: isErrorAdd, data: dataAdd, isSuccess: isSuccessAdd }
  ] = useAddBoardMutation()

  useEffect(() => {
    if (isErrorAdd) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].ERROR_REQUEST)
      myToast.show()
    }
    if (isSuccessAdd) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].BOARD_ADDED)
      myToast.show()
    }
  }, [isLoadingAdd])

  const addBoardClick = () => {
    const myToast = bootstrapToast.getOrCreateInstance(
      document.getElementById("myToast") || "myToast"
    )
    if (nameRef.current && descRef.current && id && nameRef.current?.value.trim() !== "") {
      addBoard({
        name: nameRef.current.value,
        description: descRef.current.value,
        creatorId: id,
        userIds
      })
    } else {
      setToastChildren(variables.LANGUAGES[language].INPUT_DATA)
      myToast.show()
    }
  }

  return (
    <div className=" d-flex flex-fill flex-column">
      <div className="ms-auto me-auto d-flex flex-column add-board ps-3 pe-3 flex-fill">
        <h2 className="text-center p-3">{variables.LANGUAGES[language].ADD_BOARD}</h2>
        <div className="mb-3">
          <label htmlFor="inputName">{variables.LANGUAGES[language].NAME}</label>
          <input
            className="form-control"
            id="inputName"
            placeholder={variables.LANGUAGES[language].ENTER_NAME}
            ref={nameRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputDescription">{variables.LANGUAGES[language].DESCRIPTION}</label>
          <textarea
            className="form-control"
            id="inputDescription"
            placeholder={variables.LANGUAGES[language].ENTER_DESCRIPTION}
            ref={descRef}
          />
        </div>
        <UsersList userIds={userIds} setUserIds={setUserIds} />

        <button
          type="button"
          className="btn btn-primary w-100 mt-3"
          onClick={() => addBoardClick()}
        >
          {isLoadingAdd ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
            </div>
          ) : (
            variables.LANGUAGES[language].ADD_BOARD
          )}
        </button>
      </div>
    </div>
  )
}

export default AddBoard
