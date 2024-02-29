import { localStorageConfig } from "@/config/localStorage"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ReactElement } from "react"

export interface optionsState {
  theme: string
  language: number
}

const initialState: optionsState = {
  theme: localStorage.getItem(localStorageConfig.THEME_LOCALSTORAGE) || "dark",
  language: Number.parseInt(localStorage.getItem(localStorageConfig.LANGUAGE_LOCALSTORAGE) || "1")
}

export const pageOptionsSlice = createSlice({
  name: "pageOptions",
  initialState,
  reducers: {
    setTheme: (state, { payload: theme }: PayloadAction<string>) => {
      state.theme = theme
      localStorage.setItem(localStorageConfig.THEME_LOCALSTORAGE, theme)
      document.documentElement.setAttribute("data-bs-theme", theme)
    },
    setLanguage: (state, { payload: language }: PayloadAction<number>) => {
      state.language = language
      localStorage.setItem(localStorageConfig.LANGUAGE_LOCALSTORAGE, language.toString())
    }
  }
})

export const { actions, reducer } = pageOptionsSlice
