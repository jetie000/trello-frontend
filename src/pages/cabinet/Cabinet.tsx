import { useEffect, useRef } from "react"
import { Modal as bootstrapModal } from "bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { useActions } from "@/hooks/useActions"
import { baseApi } from "@/store/api/baseApi"
import { variables } from "@/variables"
import "./Cabinet.scss"
import ModalWrapper from "../../components/modalWrapper/ModalWrapper"
import {
  useChangeUserMutation,
  useDeleteUserMutation,
  useGetByIdQuery,
  useLogoutMutation
} from "@/store/api/user.api"
import { IUser } from "@/types/user.interface"

function Cabinet() {
  const { token, id } = useSelector((state: RootState) => state.user)

  if (!token) {
    return <Navigate to={"/login"} />
  }

  const { language } = useSelector((state: RootState) => state.options)
  const { logout, showToast } = useActions()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const modalRef = useRef<HTMLDivElement>(null)
  const fullNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const newPassRef = useRef<HTMLInputElement>(null)
  const oldPassRef = useRef<HTMLInputElement>(null)

  const { isError, data: dataUser } = useGetByIdQuery(id || 0)
  const [logoutMutation, { isLoading: isLoadingLogout, isError: isErrorLogout }] =
    useLogoutMutation()
  const [
    changeUser,
    { isLoading: isLoadingChange, isSuccess: isSuccessChange, isError: isErrorChange }
  ] = useChangeUserMutation()
  const [
    deleteUser,
    { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete }
  ] = useDeleteUserMutation()

  useEffect(() => {
    if (isSuccessChange) {
      showToast(variables.LANGUAGES[language].USER_SUCCESSFULLY_CHANGED)
    }
    if (isErrorChange) {
      showToast(variables.LANGUAGES[language].ERROR_USER_DATA)
    }
  }, [isLoadingChange])

  useEffect(() => {
    if (isSuccessDelete) {
      if (modalRef.current) {
        const myModal = bootstrapModal.getOrCreateInstance("#" + modalRef.current?.id)
        myModal.hide()
      }
      showToast(variables.LANGUAGES[language].USER_SUCCESSFULLY_DELETED)
    }
    if (isErrorDelete) {
      showToast(variables.LANGUAGES[language].USER_NOT_FOUND)
    }
  }, [isLoadingDelete])

  useEffect(() => {
    if (isErrorLogout) {
      showToast(variables.LANGUAGES[language].ERROR_IN_USER_DATA)
    }
  }, [isLoadingLogout])

  const logOutClick = () => {
    dispatch(baseApi.util.resetApiState())
    logoutMutation(null)
    logout()
    navigate("/login")
  }

  const changeInfoClick = async () => {
    if (
      token &&
      dataUser &&
      "id" in dataUser &&
      emailRef.current &&
      fullNameRef.current &&
      oldPassRef.current &&
      newPassRef.current &&
      emailRef.current.value !== "" &&
      fullNameRef.current.value !== "" &&
      newPassRef.current.value !== "" &&
      oldPassRef.current.value !== ""
    ) {
      changeUser({
        email: emailRef.current.value.trim(),
        oldPassword: oldPassRef.current.value.trim(),
        fullName: fullNameRef.current.value.trim(),
        password: newPassRef.current.value.trim(),
        id: dataUser?.id || 0
      })
    }
    showToast(variables.LANGUAGES[language].INPUT_DATA)
  }

  const deleteAccClick = () => {
    if (modalRef.current) {
      const myModal = bootstrapModal.getOrCreateInstance("#" + modalRef.current?.id)
      myModal.show()
    }
  }

  return (
    <div className=" d-flex flex-fill flex-column">
      <div className="ms-auto me-auto d-flex flex-column cabinet-my-info ps-3 pe-3 flex-fill">
        <h2 className="text-center p-3">{variables.LANGUAGES[language].MY_DATA}</h2>
        <div className="mb-3">
          <label htmlFor="inputFullName">{variables.LANGUAGES[language].NAME}</label>
          <input
            className="form-control"
            id="inputFullName"
            placeholder={variables.LANGUAGES[language].ENTER_NEW_NAME}
            defaultValue={(dataUser as IUser)?.fullName}
            ref={fullNameRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputEmail">Email</label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            placeholder={variables.LANGUAGES[language].ENTER_NEW_EMAIL}
            defaultValue={(dataUser as IUser)?.email}
            ref={emailRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputOldPassword">{variables.LANGUAGES[language].OLD_PASS}</label>
          <input
            type="password"
            className="form-control"
            id="inputOldPassword"
            placeholder={variables.LANGUAGES[language].ENTER_OLD_PASS}
            ref={oldPassRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputNewPassword">{variables.LANGUAGES[language].NEW_PASSWORD}</label>
          <input
            type="password"
            className="form-control"
            id="inputNewPassword"
            placeholder={variables.LANGUAGES[language].ENTER_NEW_PASSWORD}
            ref={newPassRef}
          />
        </div>
        <button type="button" className="btn btn-primary mt-3 w-100" onClick={changeInfoClick}>
          {variables.LANGUAGES[language].CHANGE_DATA}
        </button>
      </div>
      <div className="d-flex justify-content-between cabinet-buttons mb-3">
        <button
          onClick={logOutClick}
          className="justify-self-end btn btn-danger d-flex align-items-center gap-2 mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
          {variables.LANGUAGES[language].LOGOUT}
        </button>
        <button
          onClick={deleteAccClick}
          className="justify-self-end btn btn-danger d-flex align-items-center gap-2 mt-4"
        >
          {variables.LANGUAGES[language].DELETE_ACCOUNT}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-trash3-fill"
            viewBox="0 0 16 16"
          >
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
          </svg>
        </button>
      </div>
      <ModalWrapper
        id="myInfoModal"
        title={variables.LANGUAGES[language].DELETING_ACCOUNT}
        size="sm"
        ref={modalRef}
      >
        {dataUser && "id" in dataUser && !isError ? (
          <div className="d-flex flex-column gap-3">
            <span>{variables.LANGUAGES[language].SURE_DELETE_ACC_MY}</span>
            <button
              onClick={() => {
                deleteUser(dataUser.id)
                logOutClick()
              }}
              className="btn btn-danger"
            >
              {variables.LANGUAGES[language].DELETE_ACCOUNT}
            </button>
          </div>
        ) : (
          <div>{variables.LANGUAGES[language].USER_NOT_FOUND}</div>
        )}
      </ModalWrapper>
    </div>
  )
}

export default Cabinet
