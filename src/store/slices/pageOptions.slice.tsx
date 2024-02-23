import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ReactElement } from "react"
import { variables } from "@/variables"

export interface optionsState {
  theme: string
  language: number
}

const initialState: optionsState = {
  theme: localStorage.getItem(variables.THEME_LOCALSTORAGE) || "dark",
  language: Number.parseInt(localStorage.getItem(variables.LANGUAGE_LOCALSTORAGE) || "1")
}

export const pageOptionsSlice = createSlice({
  name: "pageOptions",
  initialState,
  reducers: {
    setTheme: (state, { payload: theme }: PayloadAction<string>) => {
      state.theme = theme
      localStorage.setItem(variables.THEME_LOCALSTORAGE, theme)
      document.documentElement.setAttribute("data-bs-theme", theme)
    },
    setLanguage: (state, { payload: language }: PayloadAction<number>) => {
      state.language = language
      localStorage.setItem(variables.LANGUAGE_LOCALSTORAGE, language.toString())
    }
  }
})

export const { actions, reducer } = pageOptionsSlice
