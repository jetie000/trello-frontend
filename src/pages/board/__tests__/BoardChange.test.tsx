import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as boardApi from "@/store/api/board.api"
import * as userApi from "@/store/api/user.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { languages } from "@/config/languages"
import { skipToken } from "@reduxjs/toolkit/query"
import { mockBoards, mockReturnUsers, mockUsers } from "../../../config/mockValues"
import { mockReturnMutation } from "@/config/mockValues"
import BoardChange from "../BoardChange"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/user.api")
jest.mock("@/store/api/board.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockChange = jest.spyOn(boardApi, "useChangeBoardMutation")
const mockGetByIds = jest.spyOn(userApi, "useGetByIdsQuery")
const mockSearchUsers = jest.spyOn(userApi, "useSearchUsersQuery")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockChangeFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock }

const nameBoard = "Board 11"
const descriptionBoard = "Desc Board 11"

describe("BoardChange", () => {
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
  })
  it("should render component with all fields and buttons", () => {
    const component = render(<BoardChange board={mockBoards[0]} />)
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_DESCRIPTION)
    ).toBeInTheDocument()
    expect(screen.getByTestId("change-board-btn")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should show enter data message when provided invalid data when changing board", () => {
    const component = render(<BoardChange board={mockBoards[0]} />)
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME),
      {
        target: { value: "" }
      }
    )
    fireEvent.click(screen.getByTestId("change-board-btn"))
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].INPUT_DATA
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should change task when all fields are filled correctly", () => {
    const component = render(<BoardChange board={mockBoards[0]} />)
    expect(mockUseActions).toHaveBeenCalled()
    expect(mockChange).toHaveBeenCalled()
    expect(mockUseSelector).toHaveBeenCalled()
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME),
      {
        target: { value: nameBoard }
      }
    )
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_DESCRIPTION),
      {
        target: { value: descriptionBoard }
      }
    )
    fireEvent.click(screen.getByTestId("change-board-btn"))
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(true, true)])
    component.rerender(<BoardChange board={mockBoards[0]} />)
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(false, true)])
    component.rerender(<BoardChange board={mockBoards[0]} />)
    expect(mockChangeFunc).toHaveBeenCalledWith({
      id: mockBoards[0].id,
      name: nameBoard,
      description: descriptionBoard,
      userIds: mockBoards[0].users?.map(u => u.id) || []
    })
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].BOARD_CHANGED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
})
