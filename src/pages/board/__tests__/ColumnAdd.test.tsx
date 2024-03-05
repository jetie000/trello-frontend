import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as columnApi from "@/store/api/column.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { languages } from "@/config/languages"
import { mockReturnMutation } from "@/config/mockValues"
import ColumnAdd from "../ColumnAdd"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/column.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockAdd = jest.spyOn(columnApi, "useAddColumnMutation")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockAddFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock }

const nameColumn = "Column 4"

const boardId = 1

describe("ColumnAdd", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockAdd.mockReturnValue([mockAddFunc, mockReturnMutation(false, false)])
  })
  it("should render component with all fields and buttons", () => {
    const component = render(<ColumnAdd boardId={boardId} />)
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME)
    ).toBeInTheDocument()
    expect(screen.getByTestId("add-column-btn")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should add column when all fields are filled correctly", () => {
    const component = render(<ColumnAdd boardId={boardId} />)
    expect(mockUseActions).toHaveBeenCalled()
    expect(mockAdd).toHaveBeenCalled()
    expect(mockUseSelector).toHaveBeenCalled()
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME),
      {
        target: { value: nameColumn }
      }
    )
    fireEvent.click(screen.getByTestId("add-column-btn"))
    mockAdd.mockReturnValue([mockAddFunc, mockReturnMutation(true, true)])
    component.rerender(<ColumnAdd boardId={boardId} />)
    mockAdd.mockReturnValue([mockAddFunc, mockReturnMutation(false, true)])
    component.rerender(<ColumnAdd boardId={boardId} />)
    expect(mockAddFunc).toHaveBeenCalledWith({
      boardId,
      name: nameColumn
    })
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].COLUMN_ADDED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should show enter data message when provided invalid data when adding column", () => {
    const component = render(<ColumnAdd boardId={boardId} />)

    fireEvent.click(screen.getByTestId("add-column-btn"))
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].INPUT_DATA
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
})
