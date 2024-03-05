import * as React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ModalWrapper, { ModalProps } from "@/components/modalWrapper/ModalWrapper"

const renderModal = (params: ModalProps) => render(<ModalWrapper {...params} />)

const id = "modalId"
const title = "Modal Title"
const size = "md"
const children = "Modal Content"

describe("ModalWrapper", () => {
  it("should render a modal with the given id, title, size and children", () => {
    const component = renderModal({ id, children, size, title })

    expect(screen.getByTestId(id)).toBeInTheDocument()
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(children)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should render a modal with a header containing the title and a close button", () => {
    renderModal({ id, children, size, title })

    const modalElement = screen.getByTestId(id)
    expect(modalElement).toBeInTheDocument()
    expect(modalElement).toHaveAttribute("id", id)
    expect(modalElement).toHaveAttribute("aria-labelledby", id + "Label")

    const modalTitleElement = screen.getByText(title)
    expect(modalTitleElement).toBeInTheDocument()

    const closeButtonElement = screen.getByLabelText("Close")
    expect(closeButtonElement).toBeInTheDocument()
  })
})
