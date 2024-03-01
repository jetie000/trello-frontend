import * as React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ToastWrapper from "@/components/toastWrapper/ToastWrapper"
import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"

jest.mock("react-redux")
jest.mock("@/hooks/useActions")

const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")

const mockReturnSelectorValue = {
  language: 0,
  toastChildren: "It's toast"
}
const mockReturnActionsValue = { setToast: jest.fn() }

describe("ToastWrapper", () => {
  beforeAll(() => {
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
  })
  it("should render a toast container with a notification icon and a close button", () => {
    const component = render(<ToastWrapper />)
    const toastContainer = screen.getByRole("alert")
    const toastBody = screen.getByText(mockReturnSelectorValue.toastChildren)
    const notificationIcon = screen.getByTestId("notification-icon")
    const closeButton = screen.getByRole("button", { name: "Close" })

    expect(toastContainer).toBeInTheDocument()
    expect(toastBody).toBeInTheDocument()
    expect(notificationIcon).toBeInTheDocument()
    expect(closeButton).toBeInTheDocument()

    expect(component).toMatchSnapshot()
  })

  it("should render a toast container with the notification message", () => {
    render(<ToastWrapper />)

    const toastBody = screen.getByText(mockReturnSelectorValue.toastChildren)
    expect(toastBody).toBeInTheDocument()
  })
  it("should render a toast container at the bottom right corner of the screen", () => {
    render(<ToastWrapper />)
    const toastContainer = screen.getByRole("alert").parentNode

    expect(toastContainer).toBeInTheDocument()
    expect(toastContainer).toHaveClass("position-fixed")
    expect(toastContainer).toHaveClass("bottom-0")
    expect(toastContainer).toHaveClass("end-0")
  })
})
