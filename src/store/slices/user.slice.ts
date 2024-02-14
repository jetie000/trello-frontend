import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/types/user.interface";
import { variables } from "@/variables";


export interface userState {
    token?: string
}

const initialState: userState = {
    token: JSON.parse(localStorage.getItem(variables.TOKEN_LOCALSTORAGE)!) || undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem(variables.TOKEN_LOCALSTORAGE);
            state.token = undefined;
        },
        login: (state, { payload: token }: PayloadAction<string>) => {
            state.token = token;
            localStorage.setItem(variables.TOKEN_LOCALSTORAGE, JSON.stringify(token));
        }
    },
})

export const { actions, reducer } = userSlice