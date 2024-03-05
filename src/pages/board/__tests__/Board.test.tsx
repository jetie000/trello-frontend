import * as RRD from "react-router-dom"
import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as columnApi from "@/store/api/column.api"
import * as taskApi from "@/store/api/task.api"
import * as userApi from "@/store/api/user.api"
import * as boardApi from "@/store/api/board.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { mockReturnUsers, mockBoards, mockReturnMutation, mockUsers } from "@/config/mockValues"
import { skipToken } from "@reduxjs/toolkit/query"
import Board from "../Board"
import { languages } from "@/config/languages"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
jest.mock("@/store/api/task.api")
jest.mock("@/store/api/column.api")
jest.mock("@/store/api/board.api")

const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseDispatch = jest.spyOn(reduxHooks, "useDispatch")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockUseParams = jest.spyOn(RRD, "useParams")
const mockUseNavigate = jest.spyOn(RRD, "useNavigate")

const mockAddColumn = jest.spyOn(columnApi, "useAddColumnMutation")
const mockChangeColumn = jest.spyOn(columnApi, "useChangeColumnMutation")
const mockDeleteColumn = jest.spyOn(columnApi, "useDeleteColumnMutation")

const mockAddTask = jest.spyOn(taskApi, "useAddTaskMutation")
const mockChangeTask = jest.spyOn(taskApi, "useChangeTaskMutation")
const mockDeleteTask = jest.spyOn(taskApi, "useDeleteTaskMutation")

const mockGetByIds = jest.spyOn(userApi, "useGetByIdsQuery")
const mockSearchUsers = jest.spyOn(userApi, "useSearchUsersQuery")

const mockChangeBoard = jest.spyOn(boardApi, "useChangeBoardMutation")
const mockDeleteBoard = jest.spyOn(boardApi, "useDeleteBoardMutation")
const mockLeaveBoard = jest.spyOn(boardApi, "useLeaveBoardMutation")
const mockBoardById = jest.spyOn(boardApi, "useGetBoardByIdQuery")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}

const mockUseParamsReturn = { id: "1" }
const mockUseNavigateFunc = jest.fn()
const mockChangeBoardFunc = jest.fn()
const mockDeleteBoardFunc = jest.fn()
const mockLeaveBoardFunc = jest.fn()
const mockAddColumnFunc = jest.fn()
const mockChangeColumnFunc = jest.fn()
const mockDeleteColumnFunc = jest.fn()
const mockChangeTaskFunc = jest.fn()
const mockAddTaskFunc = jest.fn()
const mockDeleteTaskFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock }

describe("Board", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseDispatch.mockReturnValue(jest.fn())
    mockUseNavigate.mockReturnValue(mockUseNavigateFunc)
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockBoardById.mockReturnValue({
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
      data: mockBoards[0]
    })
    mockAddColumn.mockReturnValue([mockAddColumnFunc, mockReturnMutation(false, false)])
    mockChangeColumn.mockReturnValue([mockChangeColumnFunc, mockReturnMutation(false, false)])
    mockDeleteColumn.mockReturnValue([mockDeleteColumnFunc, mockReturnMutation(false, false)])
    mockChangeBoard.mockReturnValue([mockChangeTaskFunc, mockReturnMutation(false, false)])
    mockDeleteBoard.mockReturnValue([mockDeleteBoardFunc, mockReturnMutation(false, false)])
    mockLeaveBoard.mockReturnValue([mockLeaveBoardFunc, mockReturnMutation(false, false)])
    mockChangeTask.mockReturnValue([mockChangeBoardFunc, mockReturnMutation(false, false)])
    mockDeleteTask.mockReturnValue([mockDeleteTaskFunc, mockReturnMutation(false, false)])
    mockAddTask.mockReturnValue([mockAddTaskFunc, mockReturnMutation(false, false)])
    mockGetByIds.mockImplementation((ids: number[] | typeof skipToken) => {
      if (typeof ids !== "symbol")
        return mockReturnUsers(mockUsers.filter(u => ids.some(id => id === u.id))) as any
    })
    mockSearchUsers.mockReturnValue(mockReturnUsers(mockUsers))
    mockUseParams.mockReturnValue(mockUseParamsReturn)
  })
  it("should render component with all text and buttons", () => {
    const component = render(<Board />)
    mockBoards[0].columns?.forEach(c => {
      expect(screen.getByTestId("column" + c.id)).toBeInTheDocument()
      c.tasks?.forEach(t => expect(screen.getByTestId("task" + t.id)).toBeInTheDocument())
    })
    expect(screen.getByTestId("change-board-btn")).toBeInTheDocument()
    expect(screen.getByTestId("delete-board-btn")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should show loading spinner while fetching board data", () => {
    mockBoardById.mockReturnValue({
      refetch: jest.fn(),
      isLoading: true,
      isError: false,
      data: undefined
    })
    const component = render(<Board />)

    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should delete board if you are creator", () => {
    const component = render(<Board />)
    fireEvent.click(screen.getByTestId("delete-board-btn"))
    mockDeleteBoard.mockReturnValue([mockDeleteBoardFunc, mockReturnMutation(true, true)])
    component.rerender(<Board />)
    mockDeleteBoard.mockReturnValue([mockDeleteBoardFunc, mockReturnMutation(false, true)])
    component.rerender(<Board />)
    expect(mockDeleteBoardFunc).toHaveBeenCalledWith(mockBoards[0].id)
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].BOARD_DELETED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
    expect(mockUseNavigateFunc).toBeCalledWith("/")
  })
  it("should be delete and change button if you are the creator", () => {
    const component = render(<Board />)
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    expect(screen.getByTestId("delete-board-btn")).toBeInTheDocument()
    expect(screen.getByTestId("change-board-btn")).toBeInTheDocument()
    expect(screen.queryByTestId("leave-board-btn")).not.toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should be only leave button if you are not the creator", () => {
    mockUseSelector.mockReturnValue({
      language: 1,
      id: 2,
      token: "token"
    })
    const component = render(<Board />)
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    expect(screen.queryByTestId("delete-board-btn")).not.toBeInTheDocument()
    expect(screen.queryByTestId("change-board-btn")).not.toBeInTheDocument()
    expect(screen.getByTestId("leave-board-btn")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should navigate to login page if no token provided", () => {
    mockUseSelector.mockReturnValue({
      language: 1,
      id: undefined,
      token: undefined
    })
    const component = render(<Board />)
    expect(mockUseSelector).toBeCalled()
    expect(mockUseActions).not.toBeCalled()
  })
  it("should leave board if you are not the creator", () => {
    mockUseSelector.mockReturnValue({
      language: 1,
      id: 2,
      token: "token"
    })
    const component = render(<Board />)
    fireEvent.click(screen.getByTestId("leave-board-btn"))
    mockLeaveBoard.mockReturnValue([mockLeaveBoardFunc, mockReturnMutation(true, true)])
    component.rerender(<Board />)
    mockLeaveBoard.mockReturnValue([mockLeaveBoardFunc, mockReturnMutation(false, true)])
    component.rerender(<Board />)
    expect(mockLeaveBoardFunc).toHaveBeenCalledWith(mockBoards[0].id)
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].BOARD_LEFT
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
    expect(mockUseNavigateFunc).toBeCalledWith("/")
  })
})
