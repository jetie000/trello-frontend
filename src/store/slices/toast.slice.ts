import { createSlice } from "@reduxjs/toolkit"
import { Toast as bootstrapToast } from "bootstrap"
import { ReactElement, RefObject } from "react"

export interface toastState {
  toastChildren?: ReactElement | ReactElement[] | string
  toastId?: string | undefined
}

const initialState: toastState = {
  toastChildren: undefined,
  toastId: undefined
}

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, { payload: toastChildren }) => {
      state.toastChildren = toastChildren
      if (state.toastId) {
        const myToast = bootstrapToast.getOrCreateInstance("#" + state.toastId)
        myToast.show()
      }
    },
    setToast: (state, { payload: toastId }) => {
      state.toastId = toastId
    }
  }
})

export const { actions, reducer } = toastSlice
