import * as RRD from "react-router-dom"
import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as taskApi from "@/store/api/task.api"
import * as userApi from "@/store/api/user.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { languages } from "@/config/languages"
import { skipToken } from "@reduxjs/toolkit/query"
import TaskChangeDelete from "../TaskChangeDelete"
import { mockColumn, mockReturnUsers, mockUsers } from "../../../config/mockValues"
import { mockReturnMutation } from "@/config/mockValues"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
jest.mock("@/store/api/task.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseParams = jest.spyOn(RRD, "useParams")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockChange = jest.spyOn(taskApi, "useChangeTaskMutation")
const mockDelete = jest.spyOn(taskApi, "useDeleteTaskMutation")
const mockGetByIds = jest.spyOn(userApi, "useGetByIdsQuery")
const mockSearchUsers = jest.spyOn(userApi, "useSearchUsersQuery")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockUseParamsReturn = { id: "1" }
const mockChangeFunc = jest.fn()
const mockDeleteFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock }

const nameTask = "Task 11"
const descriptionTask = "Desc Task 11"

describe("TaskChangeDelete", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockGetByIds.mockImplementation((ids: number[] | typeof skipToken) => {
      if (typeof ids !== "symbol")
        return mockReturnUsers(mockUsers.filter(u => ids.some(id => id === u.id))) as any
    })
    mockSearchUsers.mockReturnValue(mockReturnUsers(mockUsers))
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(false, false)])
    mockDelete.mockReturnValue([mockDeleteFunc, mockReturnMutation(false, false)])
    mockUseParams.mockReturnValue(mockUseParamsReturn)
  })
  it("should render component with all fields and buttons", () => {
    const component = render(<TaskChangeDelete task={mockColumn.tasks![0]} />)
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_DESCRIPTION)
    ).toBeInTheDocument()
    expect(screen.getByTestId("change-task-btn")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should show enter data message when provided invalid data when changing task", () => {
    const component = render(<TaskChangeDelete task={mockColumn.tasks![0]} />)
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME),
      {
        target: { value: "" }
      }
    )
    fireEvent.click(screen.getByTestId("change-task-btn"))
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].INPUT_DATA
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should change task when all fields are filled correctly", () => {
    const component = render(<TaskChangeDelete task={mockColumn.tasks![0]} />)
    expect(mockUseActions).toHaveBeenCalled()
    expect(mockChange).toHaveBeenCalled()
    expect(mockUseSelector).toHaveBeenCalled()
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME),
      {
        target: { value: nameTask }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_DESCRIPTION),
      {
        target: { value: descriptionTask }
      }
    )
    fireEvent.click(screen.getByTestId("change-task-btn"))
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(true, true)])
    component.rerender(<TaskChangeDelete task={mockColumn.tasks![0]} />)
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(false, true)])
    component.rerender(<TaskChangeDelete task={mockColumn.tasks![0]} />)
    expect(mockChangeFunc).toHaveBeenCalledWith({
      id: mockColumn.tasks![0].id,
      columnId: mockColumn.tasks![0].columnId,
      name: nameTask,
      description: descriptionTask,
      userIds: mockColumn.tasks![0].users.map(u => u.id)
    })
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].TASK_CHANGED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should delete task", () => {
    const component = render(<TaskChangeDelete task={mockColumn.tasks![0]} />)
    fireEvent.click(screen.getByTestId("delete-task-btn"))
    mockDelete.mockReturnValue([mockDeleteFunc, mockReturnMutation(true, true)])
    component.rerender(<TaskChangeDelete task={mockColumn.tasks![0]} />)
    mockDelete.mockReturnValue([mockDeleteFunc, mockReturnMutation(false, true)])
    component.rerender(<TaskChangeDelete task={mockColumn.tasks![0]} />)
    expect(mockDeleteFunc).toHaveBeenCalledWith({
      taskId: mockColumn.tasks![0].id,
      boardId: Number(mockUseParamsReturn.id)
    })
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].TASK_DELETED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
})
