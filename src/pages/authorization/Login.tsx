import { useNavigate } from "react-router-dom"
import React, { useEffect, useRef } from "react"
import { useLogInUserMutation } from "@/store/api/user.api"
import { useActions } from "@/hooks/useActions"
import { Toast as bootstrapToast } from "bootstrap"
import { AuthResponse } from "@/types/authResponse.interface"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { variables } from "@/variables"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { IError } from "@/types/error.interface"

function Login() {
  const navigate = useNavigate()
  const { login, setToastChildren } = useActions()
  const [logInUser, { isLoading, isSuccess, isError, data, error }] = useLogInUserMutation()
  const { language } = useSelector((state: RootState) => state.options)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSuccess) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(variables.LANGUAGES[language].SUCCESFULLY_ENTERED)
      myToast.show()
      login({
        token: (data as AuthResponse)?.accessToken,
        id: (data as AuthResponse)?.id
      })
      navigate("/")
    }
    if (isError) {
      const myToast = bootstrapToast.getOrCreateInstance(
        document.getElementById("myToast") || "myToast"
      )
      setToastChildren(((error as FetchBaseQueryError).data as IError).message)
      myToast.show()
      return
    }
  }, [isLoading])

  const logIn = () => {
    if (
      passwordRef.current &&
      emailRef.current &&
      (passwordRef.current.value !== "" || emailRef.current.value !== "")
    ) {
      logInUser({
        email: emailRef.current.value.trim(),
        password: passwordRef.current.value.trim()
      })
      return
    }
    const myToast = bootstrapToast.getOrCreateInstance(
      document.getElementById("myToast") || "myToast"
    )
    setToastChildren(variables.LANGUAGES[language].INPUT_DATA)
    myToast.show()
  }

  return (
    <div className="mt-3">
      <form>
        <div className="mb-3">
          <label className="mb-1" htmlFor="inputEmail">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            placeholder={variables.LANGUAGES[language].ENTER_EMAIL}
            ref={emailRef}
          />
        </div>
        <div className="mb-3">
          <label className="mb-1" htmlFor="inputPassword">
            {variables.LANGUAGES[language].PASSWORD}
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            placeholder={variables.LANGUAGES[language].ENTER_PASSWORD}
            ref={passwordRef}
          />
        </div>
        <button type="button" className="btn btn-primary mt-3 w-100" onClick={logIn}>
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
            </div>
          ) : (
            variables.LANGUAGES[language].LOG_IN
          )}
        </button>
      </form>
    </div>
  )
}
export default Login
