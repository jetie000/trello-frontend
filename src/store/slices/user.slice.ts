import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { variables } from "@/variables";


export interface userState {
    token?: string
    id?: number
}

const initialState: userState = {
    token: localStorage.getItem(variables.TOKEN_LOCALSTORAGE) || undefined,
    id: Number(localStorage.getItem(variables.USERID_LOCALSTORAGE)) || undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem(variables.TOKEN_LOCALSTORAGE);
            localStorage.removeItem(variables.USERID_LOCALSTORAGE)
            state.token = undefined;
            state.id = undefined
        },
        login: (state, { payload: {token, id} }: PayloadAction<userState>) => {
            state.token = token;
            state.id = id
            localStorage.setItem(variables.TOKEN_LOCALSTORAGE, JSON.stringify(token));
            localStorage.setItem(variables.USERID_LOCALSTORAGE, JSON.stringify(id));
        }
    },
})

export const { actions, reducer } = userSlice