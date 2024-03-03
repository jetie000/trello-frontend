import React from "react"
import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as taskApi from "@/store/api/task.api"
import * as userApi from "@/store/api/user.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { languages } from "@/config/languages"
import TaskAdd from "../TaskAdd"
import { mockColumn } from "./Tasks.test"
import { skipToken } from "@reduxjs/toolkit/query"
import { mockReturnUsers, mockUsers } from "@/components/usersList/__tests__/UsersList.test"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
jest.mock("@/store/api/task.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockAdd = jest.spyOn(taskApi, "useAddTaskMutation")
const mockGetByIds = jest.spyOn(userApi, "useGetByIdsQuery")
const mockSearchUsers = jest.spyOn(userApi, "useSearchUsersQuery")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockAddFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock }

const nameTask = "Task 3"
const descriptionTask = "Desc Task 3"

const mockReturnMutation = (isLoading: boolean, isPressed: boolean) => ({
  isLoading: isLoading && isPressed,
  isError: false,
  isSuccess: !isLoading && isPressed,
  refetch: jest.fn(),
  reset: jest.fn()
})

describe("TaskAdd", () => {
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
    mockAdd.mockReturnValue([mockAddFunc, mockReturnMutation(false, false)])
  })
  it("should render component with all fields and buttons", () => {
    const component = render(<TaskAdd column={mockColumn} />)
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_DESCRIPTION)
    ).toBeInTheDocument()
    expect(screen.getByTestId("add-task-btn")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should change user when all fields are filled correctly", () => {
    const component = render(<TaskAdd column={mockColumn} />)
    expect(mockUseActions).toHaveBeenCalled()
    expect(mockAdd).toHaveBeenCalled()
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
    fireEvent.click(screen.getByTestId("add-task-btn"))
    mockAdd.mockReturnValue([mockAddFunc, mockReturnMutation(true, true)])
    component.rerender(<TaskAdd column={mockColumn} />)
    mockAdd.mockReturnValue([mockAddFunc, mockReturnMutation(false, true)])
    component.rerender(<TaskAdd column={mockColumn} />)
    expect(mockAddFunc).toHaveBeenCalledWith({
      columnId: mockColumn.id,
      name: nameTask,
      description: descriptionTask,
      userIds: []
    })
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].TASK_ADDED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
    expect(component).toMatchSnapshot()
  })
  it("should show enter data message when provided invalid data when changing user", () => {
    const component = render(<TaskAdd column={mockColumn} />)

    fireEvent.click(screen.getByTestId("add-task-btn"))
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].INPUT_DATA
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
})
