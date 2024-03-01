import React from "react"
import * as reduxHooks from "react-redux"
import * as reactRouterDom from "react-router-dom"
import * as actions from "@/hooks/useActions"
import * as userApi from "@/store/api/user.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { AuthResponse } from "@/types/authResponse.interface"
import Login from "../Login"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockLogin = jest.spyOn(userApi, "useLogInUserMutation")
const mockUseNavigate = jest.spyOn(reactRouterDom, "useNavigate")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockNavigateReturn = jest.fn()
const mockLoginFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock, login: jest.fn() }

const mockReturnLogin = (isLoading: boolean, isPressed: boolean) => ({
  isLoading: isLoading && isPressed,
  isError: false,
  isSuccess: !isLoading && isPressed,
  refetch: jest.fn(),
  data:
    !isLoading && isPressed
      ? ({
          accessToken: "11",
          refreshToken: "22",
          email: "test@example.com",
          id: 1
        } as AuthResponse)
      : undefined,
  reset: jest.fn()
})

describe("Login", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockLogin.mockReturnValue([mockLoginFunc, mockReturnLogin(false, false)])
    mockUseNavigate.mockReturnValue(mockNavigateReturn)
  })
  it("should log in successfully when valid email and password are entered", () => {
    const component = render(<Login />)

    expect(mockUseNavigate).toHaveBeenCalled()
    expect(mockUseActions).toHaveBeenCalled()
    expect(mockLogin).toHaveBeenCalled()
    expect(mockUseSelector).toHaveBeenCalled()
    fireEvent.change(screen.getByTestId("inputEmail"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByTestId("inputPassword"), { target: { value: "password" } })
    fireEvent.click(screen.getByRole("button", { name: "Log In" }))
    mockLogin.mockReturnValue([mockLoginFunc, mockReturnLogin(true, true)])
    component.rerender(<Login />)
    mockLogin.mockReturnValue([mockLoginFunc, mockReturnLogin(false, true)])
    component.rerender(<Login />)
    expect(mockLoginFunc).toBeCalledWith({ email: "test@example.com", password: "password" })
    expect(showToastMock).toHaveBeenCalledWith("You've succesfully entered")
    expect(showToastMock).toHaveBeenCalledTimes(1)
    expect(mockNavigateReturn).toHaveBeenCalledWith("/")
    expect(component).toMatchSnapshot()
  })
  it("should show enter data message when provided invalid data", () => {
    render(<Login />)

    fireEvent.click(screen.getByRole("button", { name: "Log In" }))
    expect(showToastMock).toHaveBeenCalledWith("Input data")
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should show loading spinner while fetching", () => {
    const component = render(<Login />)

    fireEvent.change(screen.getByTestId("inputEmail"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByTestId("inputPassword"), { target: { value: "password" } })
    fireEvent.click(screen.getByRole("button", { name: "Log In" }))
    mockLogin.mockReturnValue([mockLoginFunc, mockReturnLogin(true, true)])
    component.rerender(<Login />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
})
