import { fireEvent, render, screen } from "@testing-library/react"
import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as userApi from "@/store/api/user.api"
import UsersList from "@/components/usersList/UsersList"
import { skipToken } from "@reduxjs/toolkit/query"
import { IUserResponse } from "@/types/user.interface"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockGetByIds = jest.spyOn(userApi, "useGetByIdsQuery")
const mockSearchUsers = jest.spyOn(userApi, "useSearchUsersQuery")

const mockReturnSelectorValue = {
  language: 0
}
const users = [
  {
    id: 1,
    email: "1@gmail.com",
    fullName: "AA AA",
    loginDate: new Date()
  },
  {
    id: 2,
    email: "2@gmail.com",
    fullName: "BB BB",
    loginDate: new Date()
  },
  {
    id: 3,
    email: "3@gmail.com",
    fullName: "CC CC",
    loginDate: new Date()
  }
]
const mockReturnActionsValue = { showToast: jest.fn() }
const mockReturnUsers = (users: IUserResponse[]) => ({
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
  data: users
})

describe("UsersList", () => {
  beforeAll(() => {
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockGetByIds.mockImplementation((ids: number[] | typeof skipToken) => {
      if (typeof ids !== "symbol")
        return mockReturnUsers(users.filter(u => ids.some(id => id === u.id))) as any
    })
    mockSearchUsers.mockReturnValue(mockReturnUsers(users))
  })
  it("should render a list of 2 users", () => {
    const userIds = [1, 2]
    const setUserIds = jest.fn()
    const boardId = 1
    const component = render(
      <UsersList userIds={userIds} setUserIds={setUserIds} boardId={boardId} />
    )

    const userList = screen.getByTestId("users-list")
    expect(userList.childNodes.length).toEqual(2)
    expect(component).toMatchSnapshot()
  })
  it("should not render a list of users when userIds is empty", () => {
    const userIds: number[] = []
    const setUserIds = jest.fn()
    const boardId = 1
    const component = render(
      <UsersList userIds={userIds} setUserIds={setUserIds} boardId={boardId} />
    )

    const userList = screen.queryByTestId("users-list")
    expect(userList).not.toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should open search list when input is focused", () => {
    const userIds: number[] = []
    const setUserIds = jest.fn()
    const boardId = 1
    render(<UsersList userIds={userIds} setUserIds={setUserIds} boardId={boardId} />)

    expect(screen.queryByTestId("searchList")).not.toBeInTheDocument()
    fireEvent.focus(screen.getByTestId("search-users-input"))
    expect(screen.queryByTestId("searchList")).toBeInTheDocument()
  })
})
