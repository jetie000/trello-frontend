import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReactElement } from "react";
import { variables } from "@/variables";

export interface optionsState {
    theme: string
}

const initialState: optionsState = {
    theme: localStorage.getItem(variables.THEME_LOCALSTORAGE) || 'dark'
}

export const pageOptionsSlice = createSlice({
    name: 'pageOptions',
    initialState,
    reducers: {
        setTheme: (state, {payload: theme}: PayloadAction<string>) => {
            state.theme = theme;
            localStorage.setItem(variables.THEME_LOCALSTORAGE, theme);
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
    }
})

export const {actions, reducer} = pageOptionsSlice