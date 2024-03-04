import { fireEvent, render, screen } from "@testing-library/react"
import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as userApi from "@/store/api/user.api"
import UsersList from "@/components/usersList/UsersList"
import { skipToken } from "@reduxjs/toolkit/query"
import { mockReturnUsers, mockUsers } from "@/config/mockValues"

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

const mockReturnActionsValue = { showToast: jest.fn() }

describe("UsersList", () => {
  beforeAll(() => {
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockGetByIds.mockImplementation((ids: number[] | typeof skipToken) => {
      if (typeof ids !== "symbol")
        return mockReturnUsers(mockUsers.filter(u => ids.some(id => id === u.id))) as any
    })
    mockSearchUsers.mockReturnValue(mockReturnUsers(mockUsers))
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
