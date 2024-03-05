import {
  useDeleteBoardMutation,
  useGetBoardByIdQuery,
  useLeaveBoardMutation
} from "@/store/api/board.api"
import { useParams } from "react-router"
import { useEffect, useMemo, useRef } from "react"
import { Modal } from "bootstrap"
import Columns from "./Columns"
import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { RootStateStore } from "@/store/store"
import ModalWrapper from "../../components/modalWrapper/ModalWrapper"
import { useActions } from "@/hooks/useActions"
import BoardChange from "./BoardChange"
import ColumnAdd from "./ColumnAdd"
import { languages } from "@/config/languages"
import "./Board.scss"

function Board() {
  const { token, id: idUser } = useSelector((state: RootStateStore) => state.user)

  if (!token) {
    return <Navigate to={"/login"} />
  }

  const { id } = useParams()
  const { showToast } = useActions()
  const { language } = useSelector((state: RootStateStore) => state.options)
  const navigate = useNavigate()
  const modalRefDelete = useRef<HTMLDivElement>(null)
  const modalRefLeave = useRef<HTMLDivElement>(null)
  const modalRefChange = useRef<HTMLDivElement>(null)
  const { isLoading, isError, isSuccess, data } = useGetBoardByIdQuery(Number(id))
  const [
    deleteBoard,
    { isSuccess: isSuccessDelete, isError: isErrorDelete, isLoading: isLoadingDelete }
  ] = useDeleteBoardMutation()
  const [
    leaveBoard,
    { isSuccess: isSuccessLeave, isError: isErrorLeave, isLoading: isLoadingLeave }
  ] = useLeaveBoardMutation()

  const creatorName = useMemo(
    () => data && "name" in data && data.users?.find(u => u.id === data.creatorId)?.fullName,
    [data]
  )

  useEffect(() => {
    if (isSuccess && !data) navigate("/")
  }, [isLoading])

  useEffect(() => {
    if (isSuccessDelete) {
      if (modalRefDelete.current) {
        const myModal = Modal.getOrCreateInstance("#" + modalRefDelete.current?.id)
        myModal.hide()
      }
      navigate("/")
      showToast(languages[language].BOARD_DELETED)
    }
    if (isErrorDelete) {
      showToast(languages[language].ERROR_BOARD_DELETING)
    }
  }, [isLoadingDelete])

  useEffect(() => {
    if (isSuccessLeave) {
      navigate("/")
      showToast(languages[language].BOARD_LEFT)
    }
    if (isErrorLeave) {
      showToast(languages[language].ERROR_BOARD_LEAVING)
    }
  }, [isLoadingLeave])

  return isLoading ? (
    <div className="spinner-border m-auto" role="status">
      <span className="visually-hidden"> {languages[language].LOADING}</span>
    </div>
  ) : isError ? (
    <h1 className="m-auto">{languages[language].ERROR_REQUEST}</h1>
  ) : (
    data &&
    "name" in data && (
      <div className="d-flex gap-2 flex-fill min-w-0">
        <div className="d-flex flex-column board-info gap-2">
          <div className="d-flex flex-column border rounded-2 p-3 ">
            <h4 className="text-center">{data && data.name}</h4>
            <h6 className="text-center">
              {languages[language].CREATOR + ": "}
              {creatorName}
            </h6>
            {data?.description && <h6>{data.description}</h6>}
            {data.creatorId === idUser ? (
              <div className="d-flex gap-2 align-self-end mt-auto">
                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#changeBoard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path
                      fillRule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                    />
                  </svg>
                </button>
                <button
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteBoard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash3-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                className="btn btn-danger align-self-start mt-auto"
                data-bs-toggle="modal"
                data-bs-target="#leaveBoard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-box-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="d-flex flex-column p-3 gap-3 overflow-y-auto flex-fill border rounded-2">
            {data.users?.map(user => (
              <div className="d-flex flex-column gap-3" key={user.id}>
                <div className="d-flex gap-3">
                  <div
                    className="border rounded-circle d-flex 
                                    align-items-center justify-content-center 
                                    bg-secondary text-light fs-4 flex-shrink-0 board-users-avatar"
                  >
                    {user.fullName[0]}
                  </div>
                  <div className="d-flex flex-column min-w-0">
                    <div className="text-truncate">{user.email}</div>
                    <div className="text-truncate">{user.fullName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Columns boardColumns={data.columns} />
        <ColumnAdd boardId={data.id} />

        {data.creatorId === idUser ? (
          <>
            <ModalWrapper
              id="deleteBoard"
              title={languages[language].DELETE_BOARD}
              size="sm"
              ref={modalRefDelete}
            >
              <div className="d-flex flex-column gap-2">
                <div>{languages[language].SURE_DELETE_BOARD}</div>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteBoard(data.id)}
                  data-testid="delete-board-btn"
                >
                  {languages[language].DELETE_BOARD}
                </button>
              </div>
            </ModalWrapper>
            <ModalWrapper
              id="changeBoard"
              title={languages[language].CHANGE_BOARD}
              size="md"
              ref={modalRefChange}
            >
              <BoardChange board={data} />
            </ModalWrapper>
          </>
        ) : (
          <ModalWrapper
            id="leaveBoard"
            title={languages[language].LEAVE_BOARD}
            size="sm"
            ref={modalRefLeave}
          >
            <div className="d-flex flex-column gap-2">
              <div>{languages[language].SURE_LEAVE_BOARD}</div>
              <button
                className="btn btn-danger"
                onClick={() => leaveBoard(data.id)}
                data-testid="leave-board-btn"
              >
                {languages[language].LEAVE_BOARD}
              </button>
            </div>
          </ModalWrapper>
        )}
      </div>
    )
  )
}

export default Board
