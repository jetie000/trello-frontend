import * as React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Toast from "@/components/toast/Toast"
import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import UsersList from "@/components/usersList/UsersList"
import * as userApi from "@/store/api/user.api"

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
const mockReturnUsers = {
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
  data: [
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
}

describe("UsersList", () => {
  beforeAll(() => {
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockGetByIds.mockReturnValue(mockReturnUsers)
    mockSearchUsers.mockReturnValue(mockReturnUsers)
  })
  it("should render a list of users when userIds is not empty", () => {
    const userIds = [1, 2, 3]
    const setUserIds = jest.fn()
    const boardId = 1
    render(<UsersList userIds={userIds} setUserIds={setUserIds} boardId={boardId} />)

    const userList = screen.getByRole("list", { name: /users/i })
    expect(userList).toBeInTheDocument()
  })
})
