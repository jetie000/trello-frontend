import * as reduxHooks from "react-redux"
import * as reactRouterDom from "react-router-dom"
import * as actions from "@/hooks/useActions"
import * as userApi from "@/store/api/user.api"
import { fireEvent, render, screen } from "@testing-library/react"
import Cabinet from "../Cabinet"
import { languages } from "@/config/languages"
import { IUser } from "@/types/user.interface"
import { mockReturnMutation } from "@/config/mockValues"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockChange = jest.spyOn(userApi, "useChangeUserMutation")
const mockDelete = jest.spyOn(userApi, "useDeleteUserMutation")
const mockLogout = jest.spyOn(userApi, "useLogoutMutation")
const mockGet = jest.spyOn(userApi, "useGetByIdQuery")
const mockUseNavigate = jest.spyOn(reactRouterDom, "useNavigate")
const mockUseDispatch = jest.spyOn(reduxHooks, "useDispatch")
const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockNavigateReturn = jest.fn()
const mockDispatchReturn = jest.fn()
const mockChangeFunc = jest.fn()
const mockDeleteFunc = jest.fn()
const mockLogoutFunc = jest.fn()
const showToastMock = jest.fn()
const mockLogoutAction = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock, logout: mockLogoutAction }

const nameUser = "John Doe"
const emailUser = "john.doe@example.com"
const oldPassUser = "password123"
const newPassUser = "password123456"

const mockReturnUser = (isLoading: boolean, isPressed: boolean) => ({
  isLoading: isLoading && isPressed,
  isError: false,
  isSuccess: !isLoading && isPressed,
  refetch: jest.fn(),
  data: {
    id: mockReturnSelectorValue.id,
    fullName: nameUser,
    access: true,
    email: emailUser
  } as IUser
})

describe("Cabinet", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockDelete.mockReturnValue([mockDeleteFunc, mockReturnMutation(false, false)])
    mockLogout.mockReturnValue([mockLogoutFunc, mockReturnMutation(false, false)])
    mockGet.mockReturnValue(mockReturnUser(false, false))
    mockUseNavigate.mockReturnValue(mockNavigateReturn)
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseDispatch.mockReturnValue(mockDispatchReturn)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(false, false)])
  })
  it("should navigate to login page when token is not provided", () => {
    mockUseSelector.mockReturnValue({
      language: 1,
      id: undefined,
      token: undefined
    })
    render(<Cabinet />)
    expect(
      screen.queryByText(languages[mockReturnSelectorValue.language].MY_DATA)
    ).not.toBeInTheDocument()
  })
  it("should render component with all fields and buttons", () => {
    const component = render(<Cabinet />)
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_SURNAME_NAME)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NEW_EMAIL)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_OLD_PASS)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NEW_PASSWORD)
    ).toBeInTheDocument()
    expect(
      screen.getByText(languages[mockReturnSelectorValue.language].MY_DATA)
    ).toBeInTheDocument()
    expect(
      screen.getByText(languages[mockReturnSelectorValue.language].CHANGE_DATA)
    ).toBeInTheDocument()
    expect(
      screen.getAllByText(languages[mockReturnSelectorValue.language].DELETE_ACCOUNT).length
    ).toEqual(2)
    expect(screen.getByText(languages[mockReturnSelectorValue.language].LOGOUT)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should change user when all fields are filled correctly", () => {
    const component = render(<Cabinet />)
    expect(mockUseActions).toHaveBeenCalled()
    expect(mockChange).toHaveBeenCalled()
    expect(mockUseSelector).toHaveBeenCalled()
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_SURNAME_NAME),
      {
        target: { value: nameUser }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NEW_EMAIL),
      {
        target: { value: emailUser }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_OLD_PASS),
      {
        target: { value: oldPassUser }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NEW_PASSWORD),
      {
        target: { value: newPassUser }
      }
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: languages[mockReturnSelectorValue.language].CHANGE_DATA
      })
    )
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(true, true)])
    component.rerender(<Cabinet />)
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(false, true)])
    component.rerender(<Cabinet />)
    expect(mockChangeFunc).toHaveBeenCalledWith({
      id: mockReturnSelectorValue.id,
      email: emailUser,
      oldPassword: oldPassUser,
      password: newPassUser,
      fullName: nameUser
    })
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].USER_SUCCESSFULLY_CHANGED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
    expect(component).toMatchSnapshot()
  })
  it("should show enter data message when provided invalid data when changing user", () => {
    render(<Cabinet />)

    fireEvent.click(
      screen.getByRole("button", { name: languages[mockReturnSelectorValue.language].CHANGE_DATA })
    )
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].INPUT_DATA
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })

  it("should delete user", () => {
    const component = render(<Cabinet />)
    fireEvent.click(
      screen.getAllByText(languages[mockReturnSelectorValue.language].DELETE_ACCOUNT)[1]
    )
    expect(mockDeleteFunc).toHaveBeenCalledWith(mockReturnSelectorValue.id)
    expect(mockLogoutAction).toHaveBeenCalled()
  })

  it("should log out by clicking button", () => {
    const component = render(<Cabinet />)
    fireEvent.click(
      screen.getByRole("button", {
        name: languages[mockReturnSelectorValue.language].LOGOUT
      })
    )
    expect(mockLogoutFunc).toHaveBeenCalledWith(null)
    expect(mockNavigateReturn).toHaveBeenCalledWith("/login")
    expect(mockLogoutAction).toHaveBeenCalled()
    expect(mockDispatchReturn).toHaveBeenCalled()
  })
})
