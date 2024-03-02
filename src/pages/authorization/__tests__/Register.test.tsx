import React from "react"
import * as reduxHooks from "react-redux"
import * as reactRouterDom from "react-router-dom"
import * as actions from "@/hooks/useActions"
import * as userApi from "@/store/api/user.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { AuthResponse } from "@/types/authResponse.interface"
import Register from "../Register"
import { languages } from "@/config/languages"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockRegister = jest.spyOn(userApi, "useRegisterUserMutation")
const mockUseNavigate = jest.spyOn(reactRouterDom, "useNavigate")

const nameUser = "John Doe"
const emailUser = "john.doe@example.com"
const passUser = "password123"

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockNavigateReturn = jest.fn()
const mockRegisterFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock, login: jest.fn() }

const mockReturnRegister = (isLoading: boolean, isPressed: boolean) => ({
  isLoading: isLoading && isPressed,
  isError: false,
  isSuccess: !isLoading && isPressed,
  refetch: jest.fn(),
  data:
    !isLoading && isPressed
      ? ({
          accessToken: "11",
          refreshToken: "22",
          email: emailUser
        } as AuthResponse)
      : undefined,
  reset: jest.fn()
})

describe("Register", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockRegister.mockReturnValue([mockRegisterFunc, mockReturnRegister(false, false)])
    mockUseNavigate.mockReturnValue(mockNavigateReturn)
  })
  it("should register user when all fields are filled correctly", () => {
    const component = render(<Register />)
    expect(mockUseActions).toHaveBeenCalled()
    expect(mockRegister).toHaveBeenCalled()
    expect(mockUseSelector).toHaveBeenCalled()

    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_SURNAME_NAME),
      {
        target: { value: nameUser }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_EMAIL),
      {
        target: { value: emailUser }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_PASSWORD),
      {
        target: { value: passUser }
      }
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: languages[mockReturnSelectorValue.language].REGISTER_
      })
    )
    mockRegister.mockReturnValue([mockRegisterFunc, mockReturnRegister(true, true)])
    component.rerender(<Register />)
    mockRegister.mockReturnValue([mockRegisterFunc, mockReturnRegister(false, true)])
    component.rerender(<Register />)
    expect(mockRegisterFunc).toHaveBeenCalledWith({
      email: emailUser,
      password: passUser,
      fullName: nameUser
    })
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].SUCCESFULLY_REGISTERED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
    expect(component).toMatchSnapshot()
  })
  it("should show enter data message when provided invalid data", () => {
    render(<Register />)

    fireEvent.click(
      screen.getByRole("button", {
        name: languages[mockReturnSelectorValue.language].REGISTER_
      })
    )
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].INPUT_DATA
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should show loading spinner while fetching", () => {
    const component = render(<Register />)

    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_SURNAME_NAME),
      {
        target: { value: nameUser }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_EMAIL),
      {
        target: { value: emailUser }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_PASSWORD),
      {
        target: { value: passUser }
      }
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: languages[mockReturnSelectorValue.language].REGISTER_
      })
    )
    mockRegister.mockReturnValue([mockRegisterFunc, mockReturnRegister(true, true)])
    component.rerender(<Register />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
})
