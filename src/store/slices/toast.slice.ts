import { createSlice } from "@reduxjs/toolkit";
import { ReactElement } from "react";

export interface toastState {
    toastChildren?: ReactElement | ReactElement[] | string
}

const initialState: toastState = {
    toastChildren: undefined
}

export const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToastChildren: (state, {payload: toastChildren}) => {
            state.toastChildren = toastChildren;
        }
    }
})

export const {actions, reducer} = toastSlice