import React from "react"
import * as reduxHooks from "react-redux"
import * as reactRouterDom from "react-router-dom"
import * as actions from "@/hooks/useActions"
import { fireEvent, render, screen } from "@testing-library/react"
import { boardApi } from "@/store/api/board.api"
import { IBoard } from "@/types/board.interface"
import MyBoards from "../MyBoards"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/board.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockGetBoardsByUser = jest.spyOn(boardApi, "useGetBoardByUserIdQuery")
const mockUseNavigate = jest.spyOn(reactRouterDom, "useNavigate")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockNavigateReturn = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock }

const mockBoards: IBoard[] = [
  {
    id: 1,
    creatorId: 1,
    name: "Board1"
  },
  {
    id: 2,
    creatorId: 1,
    name: "Board2"
  },
  {
    id: 3,
    creatorId: 1,
    name: "Board3"
  }
]

describe("MyBoards", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockGetBoardsByUser.mockReturnValue({
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      data: mockBoards
    })
    mockUseNavigate.mockReturnValue(mockNavigateReturn)
  })
  it("should show a list of boards when data is fetched successfully and there are multiple boards", () => {
    const component = render(<MyBoards />)
    expect(mockGetBoardsByUser).toHaveBeenCalledWith(1)
    expect(mockNavigateReturn).not.toHaveBeenCalled()
    expect(showToastMock).not.toHaveBeenCalled()
    expect(screen.getByText("Board1")).toBeInTheDocument()
    expect(screen.getByText("Board2")).toBeInTheDocument()
    expect(screen.getByText("Board3")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should navigate to the board when clicked on the board", () => {
    render(<MyBoards />)
    fireEvent.click(screen.getByText("Board1"))
    expect(mockNavigateReturn).toHaveBeenCalledWith("/board/1")
  })
  it("should show spinner while fetching boards", () => {
    mockGetBoardsByUser.mockReturnValue({
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
      data: mockBoards
    })
    render(<MyBoards />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })
})
