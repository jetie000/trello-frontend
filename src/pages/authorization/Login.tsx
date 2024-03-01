import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import { useLogInUserMutation } from "@/store/api/user.api"
import { useActions } from "@/hooks/useActions"
import { AuthResponse } from "@/types/authResponse.interface"
import { useSelector } from "react-redux"
import { RootStateStore } from "@/store/store"
import { languages } from "@/config/languages"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { IError } from "@/types/error.interface"

function Login() {
  const navigate = useNavigate()
  const { login, showToast } = useActions()
  const [logInUser, { isLoading, isSuccess, isError, data, error }] = useLogInUserMutation()
  const { language } = useSelector((state: RootStateStore) => state.options)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSuccess) {
      showToast(languages[language].SUCCESFULLY_ENTERED)
      login({
        token: (data as AuthResponse)?.accessToken,
        id: (data as AuthResponse)?.id
      })
      navigate("/")
    }
    if (isError) {
      showToast(((error as FetchBaseQueryError).data as IError).message)
    }
  }, [isLoading])

  const logIn = () => {
    if(isLoading) return
    if (
      passwordRef.current &&
      emailRef.current &&
      passwordRef.current.value.trim() !== "" &&
      emailRef.current.value.trim() !== ""
    ) {
      logInUser({
        email: emailRef.current.value.trim(),
        password: passwordRef.current.value.trim()
      })
      return
    }
    showToast(languages[language].INPUT_DATA)
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
            placeholder={languages[language].ENTER_EMAIL}
            ref={emailRef}
            data-testid="inputEmail"
          />
        </div>
        <div className="mb-3">
          <label className="mb-1" htmlFor="inputPassword">
            {languages[language].PASSWORD}
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            placeholder={languages[language].ENTER_PASSWORD}
            ref={passwordRef}
            data-testid="inputPassword"
          />
        </div>
        <button type="button" className="btn btn-primary mt-3 w-100" onClick={logIn}>
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">{languages[language].LOADING}</span>
            </div>
          ) : (
            languages[language].LOG_IN
          )}
        </button>
      </form>
    </div>
  )
}
export default Login
