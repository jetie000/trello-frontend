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
jest.mock("@/store/api/task.api")
jest.mock("@/store/api/column.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseDispatch = jest.spyOn(reduxHooks, "useDispatch")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockChangeColumn = jest.spyOn(columnApi, "useChangeColumnMutation")
const mockAddTask = jest.spyOn(taskApi, "useAddTaskMutation")
const mockChangeTask = jest.spyOn(taskApi, "useChangeTaskMutation")
const mockDeleteTask = jest.spyOn(taskApi, "useDeleteTaskMutation")
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
const mockAddTaskFunc = jest.fn()
const mockDeleteTaskFunc = jest.fn()
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
    mockDeleteTask.mockReturnValue([mockDeleteTaskFunc, mockReturnMutation(false, false)])
    mockAddTask.mockReturnValue([mockAddTaskFunc, mockReturnMutation(false, false)])
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
  })
  it("should allow dragging and dropping tasks between columns", () => {
    const component = render(<Columns boardColumns={mockBoards[0].columns} />)

    let task1 = screen.getByTestId("task" + mockBoards[0].columns![0].tasks![0].id)
    let task2 = screen.getByTestId("task" + mockBoards[0].columns![0].tasks![1].id)
    let column2 = screen.getByTestId("column" + mockBoards[0].columns![1].id)
    let column1 = screen.getByTestId("column" + mockBoards[0].columns![0].id)

    fireEvent.dragStart(task1)
    fireEvent.drop(column2)
    expect(column1.lastChild?.childNodes.length).toEqual(3)
    expect(column2.lastChild?.childNodes.length).toEqual(3)
    expect(mockChangeTaskFunc).toHaveBeenCalledWith({
      id: 1,
      name: mockBoards[0].columns![0].tasks![0].name,
      userIds: mockBoards[0].columns![0].tasks![0].users.map(u => u.id),
      columnId: 2
    })

    fireEvent.dragStart(task2)
    fireEvent.drop(column2)
    expect(column1.lastChild?.childNodes.length).toEqual(1)
    expect(column2.lastChild?.childNodes.length).toEqual(4)
    expect(mockChangeTaskFunc).toHaveBeenCalledWith({
      id: 2,
      name: mockBoards[0].columns![0].tasks![1].name,
      userIds: mockBoards[0].columns![0].tasks![1].users.map(u => u.id),
      columnId: 2
    })

    task1 = screen.getByTestId("task" + mockBoards[0].columns![0].tasks![0].id)
    column1 = screen.getByTestId("column" + mockBoards[0].columns![0].id)
    fireEvent.dragStart(task1)
    fireEvent.drop(column1)
    expect(column1.lastChild?.childNodes.length).toEqual(3)
    expect(column2.lastChild?.childNodes.length).toEqual(3)
    expect(mockChangeTaskFunc).toHaveBeenCalledWith({
      id: 1,
      name: mockBoards[0].columns![0].tasks![0].name,
      userIds: mockBoards[0].columns![0].tasks![0].users.map(u => u.id),
      columnId: 1
    })

    expect(screen.getByText(mockBoards[0].columns![0].tasks![0].name)).toBeInTheDocument()
    expect(screen.getByText(mockBoards[0].columns![0].tasks![1].name)).toBeInTheDocument()
  })
  it("should allow changing columns order by dragging and dropping", () => {
    const component = render(<Columns boardColumns={mockBoards[0].columns} />)

    const column1 = screen.getByTestId("column" + mockBoards[0].columns![0].id)
    const column2 = screen.getByTestId("column" + mockBoards[0].columns![1].id)
    fireEvent.dragStart(column1)
    fireEvent.drop(column2)

    expect(column1.parentElement?.children[1]).toEqual(column1)
    expect(column2.parentElement?.children[0]).toEqual(column2)
    expect(mockChangeColumnFunc).toHaveBeenCalledWith({
      id: 1,
      order: 2,
      name: mockBoards[0].columns![0].name
    })
  })
})
