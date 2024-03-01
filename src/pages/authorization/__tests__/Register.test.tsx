import React from "react"
import * as reduxHooks from "react-redux"
import * as reactRouterDom from "react-router-dom"
import * as actions from "@/hooks/useActions"
import * as userApi from "@/store/api/user.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { AuthResponse } from "@/types/authResponse.interface"
import Register from "../Register"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockRegister = jest.spyOn(userApi, "useRegisterUserMutation")
const mockUseNavigate = jest.spyOn(reactRouterDom, "useNavigate")

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
          email: "test@example.com"
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

    fireEvent.change(screen.getByPlaceholderText("Enter surname and name"), {
      target: { value: "John Doe" }
    })
    fireEvent.change(screen.getByPlaceholderText("Input e-mail"), {
      target: { value: "john.doe@example.com" }
    })
    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "password123" }
    })
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }))
    mockRegister.mockReturnValue([mockRegisterFunc, mockReturnRegister(true, true)])
    component.rerender(<Register />)
    mockRegister.mockReturnValue([mockRegisterFunc, mockReturnRegister(false, true)])
    component.rerender(<Register />)
    expect(mockRegisterFunc).toHaveBeenCalledWith({
      email: "john.doe@example.com",
      password: "password123",
      fullName: "John Doe"
    })
    expect(showToastMock).toHaveBeenCalledWith(
      "You've succesfully registered. Check your e-mail for confirm letter"
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
    expect(component).toMatchSnapshot()
  })
  it("should show enter data message when provided invalid data", () => {
    render(<Register />)

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }))
    expect(showToastMock).toHaveBeenCalledWith("Input data")
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should show loading spinner while fetching", () => {
    const component = render(<Register />)

    fireEvent.change(screen.getByPlaceholderText("Enter surname and name"), {
      target: { value: "John Doe" }
    })
    fireEvent.change(screen.getByPlaceholderText("Input e-mail"), {
      target: { value: "john.doe@example.com" }
    })
    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "password123" }
    })
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }))
    mockRegister.mockReturnValue([mockRegisterFunc, mockReturnRegister(true, true)])
    component.rerender(<Register />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
})
