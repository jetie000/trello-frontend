import React from "react"
import * as reduxHooks from "react-redux"
import * as reactRouterDom from "react-router-dom"
import * as actions from "@/hooks/useActions"
import * as userApi from "@/store/api/user.api"
import { fireEvent, queryByText, render, screen } from "@testing-library/react"
import { languages } from "@/config/languages"
import { IUser } from "@/types/user.interface"
import { IColumn } from "@/types/column.interface"
import Tasks, { TasksProps } from "../Tasks"

jest.mock("@/store/store")
jest.mock("react-redux")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}

const renderTasks = (params: TasksProps) => render(<Tasks {...params} />)

const setCurrentColumn = jest.fn()
const setDrugStartTask = jest.fn()
const setCurrentTask = jest.fn()
export const mockColumn: IColumn = {
  id: 1,
  boardId: 1,
  name: "TODO",
  order: 1,
  tasks: [
    {
      id: 1,
      columnId: 1,
      name: "Task 1",
      creationDate: new Date(0),
      moveDate: new Date(0),
      description: "Description of Task 1",
      users: [
        { id: 1, fullName: "User 1" },
        { id: 2, fullName: "User 2" },
        { id: 3, fullName: "User 3" }
      ]
    },
    {
      id: 2,
      columnId: 1,
      name: "Task 2",
      creationDate: new Date(),
      moveDate: new Date(),
      description: "Description of Task 2",
      users: [
        { id: 4, fullName: "User 4" },
        { id: 5, fullName: "User 5" }
      ]
    }
  ]
} as IColumn

describe("Tasks", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
  })
  it("should render a list of given tasks", () => {
    const component = renderTasks({
      column: mockColumn,
      setCurrentTask,
      setDrugStartTask,
      setCurrentColumn
    })
    const taskElements = screen.getAllByTestId(/task[0-9+]/)
    expect(taskElements.length).toBe(2)
    expect(component).toMatchSnapshot()
  })
  it("should render only the add task button when column has no tasks", () => {
    const column = {
      id: 1,
      boardId: 1,
      name: "TODO",
      order: 1,
      tasks: []
    }
    const component = renderTasks({ column, setCurrentTask, setDrugStartTask, setCurrentColumn })

    const taskElements = screen.queryAllByTestId(/task[0-9+]/)
    expect(taskElements.length).toBe(0)

    const addButton = screen.getByTestId("show-add-task")
    expect(addButton).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should set the current task as the drag start task when dragging a task", () => {
    renderTasks({ column: mockColumn, setCurrentTask, setDrugStartTask, setCurrentColumn })

    const taskElement = screen.getByText("Task 1")
    fireEvent.dragStart(taskElement)

    expect(setDrugStartTask).toHaveBeenCalledWith(mockColumn.tasks![0])
  })
  it('should display "add users" when task has no users', () => {
    const column: IColumn = {
      id: 1,
      name: "Column 1",
      boardId: 1,
      order: 1,
      tasks: [
        {
          id: 1,
          name: "Task 1",
          description: "Description of Task 1",
          users: [],
          creationDate: new Date(),
          moveDate: new Date(),
          Column: { id: 1, name: "Column 1", order: 1, boardId: 1 },
          columnId: 1
        }
      ]
    }
    const component = renderTasks({ column, setCurrentTask, setDrugStartTask, setCurrentColumn })

    const addUserElement = screen.getByText(/add users/i)
    expect(addUserElement).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
})
