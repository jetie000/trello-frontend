import React, { useEffect, useRef, useState } from "react"
import Modal from "@/components/modal/Modal"
import { useRegisterUserMutation } from "@/store/api/user.api"
import { Toast as bootstrapToast } from "bootstrap"
import { useActions } from "@/hooks/useActions"
import { IError } from "@/types/error.interface"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { variables } from "@/variables"

function Register() {
  const [registerUser, { isLoading, isSuccess, isError, error }] = useRegisterUserMutation()
  const { language } = useSelector((state: RootState) => state.options)
  const { setToastChildren } = useActions()
  const fullNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const myToast = bootstrapToast.getOrCreateInstance(
      document.getElementById("myToast") || "myToast"
    )
    if (isSuccess && fullNameRef.current && passwordRef.current && emailRef.current) {
      setToastChildren(variables.LANGUAGES[language].SUCCESFULLY_REGISTERED)
      fullNameRef.current.value = ""
      passwordRef.current.value = ""
      emailRef.current.value = ""
      myToast.show()
    }
    if (isError) {
      console.log(error)

      setToastChildren(((error as FetchBaseQueryError)?.data as IError).message)
      myToast.show()
    }
  }, [isLoading])

  const registerClick = () => {
    if (
      fullNameRef.current &&
      passwordRef.current &&
      emailRef.current &&
      (fullNameRef.current.value !== "" ||
        passwordRef.current.value !== "" ||
        emailRef.current.value !== "")
    ) {
      registerUser({
        email: emailRef.current.value.trim(),
        password: passwordRef.current.value.trim(),
        fullName: fullNameRef.current.value.trim()
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
          <label htmlFor="inputFullName">{variables.LANGUAGES[language].SURNAME_AND_NAME}</label>
          <input
            className="form-control"
            id="inputFullName"
            placeholder={variables.LANGUAGES[language].ENTER_SURNAME_NAME}
            ref={fullNameRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputEmail">Email</label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            placeholder={variables.LANGUAGES[language].ENTER_EMAIL}
            ref={emailRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword">{variables.LANGUAGES[language].PASSWORD}</label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            placeholder={variables.LANGUAGES[language].ENTER_PASSWORD}
            ref={passwordRef}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary mt-3 w-100"
          onClick={() => registerClick()}
        >
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
            </div>
          ) : (
            variables.LANGUAGES[language].REGISTER_
          )}
        </button>
      </form>
    </div>
  )
}

export default Register
