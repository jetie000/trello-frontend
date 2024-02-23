import React, { useEffect, useState } from "react"
import { Modal as bootstrapModal } from "bootstrap"
import { Toast as bootstrapToast } from "bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useActions } from "@/hooks/useActions"
import { baseApi } from "@/store/api/baseApi"
import { variables } from "@/variables"
import "./Cabinet.scss"
import Modal from "../../components/modal/Modal"
import { IModalInfo } from "@/types/modalInfo.interface"
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

  const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: "", children: "" })
  const { language } = useSelector((state: RootState) => state.options)
  const { logout, setToastChildren } = useActions()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isError, data: dataUser } = useGetByIdQuery(id || 0)
  const [logoutMutation, { isLoading: isLoadingLogout, isError: isErrorLogout }] =
    useLogoutMutation()
  const [
    changeUser,
    { isLoading: isLoadingChange, isSuccess: isSuccessChange, isError: isErrorChange, error }
  ] = useChangeUserMutation()
  const [
    deleteUser,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete
    }
  ] = useDeleteUserMutation()

  useEffect(() => {
    const myToast = bootstrapToast.getOrCreateInstance(
      document.getElementById("myToast") || "myToast"
    )
    if (isSuccessChange) {
      setToastChildren(variables.LANGUAGES[language].USER_SUCCESSFULLY_CHANGED)
      myToast.show()
    }
    if (isErrorChange) {
      setToastChildren(variables.LANGUAGES[language].ERROR_USER_DATA)
      myToast.show()
    }
  }, [isLoadingChange])

  useEffect(() => {
    const myToast = bootstrapToast.getOrCreateInstance(
      document.getElementById("myToast") || "myToast"
    )
    if (isSuccessDelete) {
      const myModal = bootstrapModal.getOrCreateInstance(
        document.getElementById("myInfoModal") || "myInfoModal"
      )
      myModal.hide()
      setToastChildren(variables.LANGUAGES[language].USER_SUCCESSFULLY_DELETED)
      myToast.show()
    }
    if (isErrorDelete) {
      setToastChildren(variables.LANGUAGES[language].USER_NOT_FOUND)
      myToast.show()
    }
  }, [isLoadingDelete])

  useEffect(() => {
    if (isErrorLogout) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].ERROR_IN_USER_DATA)
      myToast.show()
    }
  }, [isLoadingLogout])

  const logOutClick = () => {
    dispatch(baseApi.util.resetApiState())
    logoutMutation(null)
    logout()
    navigate("/login")
  }

  const changeInfoClick = async () => {
    let inputFullName = (document.getElementById("inputFullName") as HTMLInputElement).value
    let inputEmail = (document.getElementById("inputEmail") as HTMLInputElement).value
    let inputOldPassword = (document.getElementById("inputOldPassword") as HTMLInputElement).value
    let inputNewPassword = (document.getElementById("inputNewPassword") as HTMLInputElement).value
    if (inputEmail == "" || inputOldPassword == "" || inputFullName == "") {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].INPUT_DATA)
      myToast.show()
      return
    }
    if (token && dataUser && "id" in dataUser)
      changeUser({
        email: inputEmail.trim(),
        oldPassword: inputOldPassword.trim(),
        fullName: inputFullName.trim(),
        password: inputNewPassword.trim(),
        id: dataUser?.id || 0
      })
  }

  const deleteAccClick = () => {
    const myModal = bootstrapModal.getOrCreateInstance(
      document.getElementById("myInfoModal") || "myInfoModal"
    )
    const children =
      dataUser && "id" in dataUser && !isError ? (
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
      )
    setModalInfo({ title: variables.LANGUAGES[language].DELETING_ACCOUNT, children: children })
    myModal.show()
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputOldPassword">{variables.LANGUAGES[language].OLD_PASS}</label>
          <input
            type="password"
            className="form-control"
            id="inputOldPassword"
            placeholder={variables.LANGUAGES[language].ENTER_OLD_PASS}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputNewPassword">{variables.LANGUAGES[language].NEW_PASSWORD}</label>
          <input
            type="password"
            className="form-control"
            id="inputNewPassword"
            placeholder={variables.LANGUAGES[language].ENTER_NEW_PASSWORD}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary mt-3 w-100"
          onClick={() => changeInfoClick()}
        >
          {variables.LANGUAGES[language].CHANGE_DATA}
        </button>
      </div>
      <div className="d-flex justify-content-between cabinet-buttons mb-3">
        <button
          onClick={() => logOutClick()}
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
          onClick={() => deleteAccClick()}
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
      <Modal id="myInfoModal" title={modalInfo.title} size="sm">
        {modalInfo.children}
      </Modal>
    </div>
  )
}

export default Cabinet
