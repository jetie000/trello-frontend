import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as columnApi from "@/store/api/column.api"
import { fireEvent, render, screen } from "@testing-library/react"
import { languages } from "@/config/languages"
import { mockColumn, mockReturnMutation } from "@/config/mockValues"
import ColumnChangeDelete from "../ColumnChangeDelete"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/column.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockChange = jest.spyOn(columnApi, "useChangeColumnMutation")
const mockDelete = jest.spyOn(columnApi, "useDeleteColumnMutation")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockChangeFunc = jest.fn()
const mockDeleteFunc = jest.fn()
const showToastMock = jest.fn()
const mockReturnActionsValue = { showToast: showToastMock }

const nameColumn = "Column 11"

describe("ColumnChangeDelete", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(false, false)])
    mockDelete.mockReturnValue([mockDeleteFunc, mockReturnMutation(false, false)])
  })
  it("should render component with all fields and buttons", () => {
    const component = render(<ColumnChangeDelete currentColumn={mockColumn} />)
    expect(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME)
    ).toBeInTheDocument()
    expect(screen.getByTestId("change-column-btn")).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should show enter data message when provided invalid data when changing column", () => {
    const component = render(<ColumnChangeDelete currentColumn={mockColumn} />)
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME),
      {
        target: { value: "" }
      }
    )
    fireEvent.click(screen.getByTestId("change-column-btn"))
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].INPUT_DATA
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should change column when all fields are filled correctly", () => {
    const component = render(<ColumnChangeDelete currentColumn={mockColumn} />)
    expect(mockUseActions).toHaveBeenCalled()
    expect(mockChange).toHaveBeenCalled()
    expect(mockUseSelector).toHaveBeenCalled()
    fireEvent.change(
      screen.getByPlaceholderText(languages[mockReturnSelectorValue.language].ENTER_NAME),
      {
        target: { value: nameColumn }
      }
    )
    fireEvent.click(screen.getByTestId("change-column-btn"))
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(true, true)])
    component.rerender(<ColumnChangeDelete currentColumn={mockColumn} />)
    mockChange.mockReturnValue([mockChangeFunc, mockReturnMutation(false, true)])
    component.rerender(<ColumnChangeDelete currentColumn={mockColumn} />)
    expect(mockChangeFunc).toHaveBeenCalledWith({
      id: mockColumn.id,
      name: nameColumn,
      order: mockColumn.order
    })
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].COLUMN_CHANGED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
  it("should delete column", () => {
    const component = render(<ColumnChangeDelete currentColumn={mockColumn} />)
    fireEvent.click(screen.getByTestId("delete-column-btn"))
    mockDelete.mockReturnValue([mockDeleteFunc, mockReturnMutation(true, true)])
    component.rerender(<ColumnChangeDelete currentColumn={mockColumn} />)
    mockDelete.mockReturnValue([mockDeleteFunc, mockReturnMutation(false, true)])
    component.rerender(<ColumnChangeDelete currentColumn={mockColumn} />)
    expect(mockDeleteFunc).toHaveBeenCalledWith(mockColumn.id)
    expect(showToastMock).toHaveBeenCalledWith(
      languages[mockReturnSelectorValue.language].COLUMN_DELETED
    )
    expect(showToastMock).toHaveBeenCalledTimes(1)
  })
})
