import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as columnApi from "@/store/api/column.api"
import * as taskApi from "@/store/api/task.api"
import * as userApi from "@/store/api/user.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { mockReturnUsers, mockBoards, mockReturnMutation, mockUsers } from "@/config/mockValues"
import Columns from "../Columns"
import { skipToken } from "@reduxjs/toolkit/query"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseDispatch = jest.spyOn(reduxHooks, "useDispatch")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockChangeColumn = jest.spyOn(columnApi, "useChangeColumnMutation")
const mockChangeTask = jest.spyOn(taskApi, "useChangeTaskMutation")
const mockDeleteColumn = jest.spyOn(columnApi, "useDeleteColumnMutation")
const mockGetByIds = jest.spyOn(userApi, "useGetByIdsQuery")
const mockSearchUsers = jest.spyOn(userApi, "useSearchUsersQuery")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockChangeColumnFunc = jest.fn()
const mockDeleteColumnFunc = jest.fn()
const mockChangeTaskFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock }

describe("Columns", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseDispatch.mockReturnValue(jest.fn())
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockChangeColumn.mockReturnValue([mockChangeColumnFunc, mockReturnMutation(false, false)])
    mockDeleteColumn.mockReturnValue([mockDeleteColumnFunc, mockReturnMutation(false, false)])
    mockChangeTask.mockReturnValue([mockChangeTaskFunc, mockReturnMutation(false, false)])
    mockGetByIds.mockImplementation((ids: number[] | typeof skipToken) => {
      if (typeof ids !== "symbol")
        return mockReturnUsers(mockUsers.filter(u => ids.some(id => id === u.id))) as any
    })
    mockSearchUsers.mockReturnValue(mockReturnUsers(mockUsers))
  })
  it("should render component with all text and buttons", () => {
    const component = render(<Columns boardColumns={mockBoards[0].columns} />)
    mockBoards[0].columns?.forEach(c => {
      expect(screen.getByTestId("column" + c.id)).toBeInTheDocument()
      c.tasks?.forEach(t => expect(screen.getByTestId("task" + t.id)).toBeInTheDocument())
    })
    expect(screen.getByTestId("change-column-btn")).toBeInTheDocument()
    expect(screen.getByTestId("delete-column-btn")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should allow dragging and dropping tasks between columns", () => {
    const component = render(<Columns boardColumns={mockBoards[0].columns} />)

    const task1 = screen.getByTestId("task" + mockBoards[0].columns![0].tasks![0].id)
    const column2 = screen.getByTestId("column" + mockBoards[0].columns![1].id)
    const column1 = screen.getByTestId("column" + mockBoards[0].columns![0].id)
    fireEvent.dragStart(task1)
    fireEvent.drop(column2)

    expect(column2.lastChild?.childNodes.length).toEqual(3)
    expect(column2.lastChild?.childNodes.length).toEqual(3)
    // expect(mockChangeTaskFunc).toHaveBeenCalledWith({
    //   id: 1,
    //   name: mockBoards[0].columns![0].tasks![0].name,
    //   userIds: mockBoards[0].columns![0].tasks![0].users.map(u => u.id),
    //   columnId: 2
    // })

    expect(screen.getByText(mockBoards[0].columns![0].tasks![0].name)).toBeInTheDocument()
    expect(screen.getByText(mockBoards[0].columns![0].tasks![1].name)).toBeInTheDocument()
  })
})
