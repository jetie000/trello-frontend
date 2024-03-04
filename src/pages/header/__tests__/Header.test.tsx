import * as reduxHooks from "react-redux"
import * as reactRouterDom from "react-router-dom"
import * as actions from "@/hooks/useActions"
import { fireEvent, render, screen } from "@testing-library/react"
import Header from "../Header"
import { languages } from "@/config/languages"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("react-router-dom")
jest.mock("@/hooks/useActions")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockUseNavigate = jest.spyOn(reactRouterDom, "useNavigate")

const mockReturnSelectorValue = {
  language: 1,
  token: "token",
  theme: "dark"
}
const mockNavigateReturn = jest.fn()
const setLanguageMock = jest.fn()
const setThemeMock = jest.fn()
const mockReturnActionsValue = { setLanguage: setLanguageMock, setTheme: setThemeMock }

describe("Header", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockUseNavigate.mockReturnValue(mockNavigateReturn)
  })
  it("should display the correct navbar items when the user is logged in", () => {
    const component = render(<Header />)

    expect(screen.getByRole("navigation")).toBeInTheDocument()
    expect(screen.getAllByTestId("dropdown-toggle").length).toEqual(2)
    expect(screen.getAllByTestId("dropdown-menu").length).toEqual(2)
    expect(
      screen.getByText(languages[mockReturnSelectorValue.language].MY_BOARDS)
    ).toBeInTheDocument()
    expect(
      screen.getByText(languages[mockReturnSelectorValue.language].ADD_BOARD)
    ).toBeInTheDocument()
    expect(
      screen.getByText(languages[mockReturnSelectorValue.language].CABINET)
    ).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should display the correct navbar items when the user is not logged in", () => {
    mockUseSelector.mockReturnValue({ language: 1, token: undefined, theme: "dark" })
    const component = render(<Header />)

    expect(
      screen.queryByText(languages[mockReturnSelectorValue.language].MY_BOARDS)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(languages[mockReturnSelectorValue.language].ADD_BOARD)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(languages[mockReturnSelectorValue.language].CABINET)
    ).not.toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should change language and theme", () => {
    const component = render(<Header />)

    fireEvent.click(screen.getByText(languages[mockReturnSelectorValue.language].LIGHT))
    mockUseSelector.mockReturnValue({ language: 1, token: "token", theme: "light" })
    component.rerender(<Header />)
    expect(screen.getByTestId("light-icon")).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Русский/i))
    mockUseSelector.mockReturnValue({ language: 0, token: "token", theme: "light" })
    component.rerender(<Header />)
    expect(screen.getByText("Кабинет")).toBeInTheDocument()
    expect(setThemeMock).toBeCalledWith("light")
    expect(setLanguageMock).toBeCalledWith(0)
    expect(component).toMatchSnapshot()
  })
})
