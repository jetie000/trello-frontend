import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/types/user.interface";
import { variables } from "@/variables";


export interface userState {
    user?: IUser
}

const initialState: userState = {
    user: JSON.parse(localStorage.getItem(variables.USER_LOCALSTORAGE)!) || undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem(variables.USER_LOCALSTORAGE);
            state.user = undefined;
        },
        setUser: (state, { payload: user }: PayloadAction<IUser>) => {
            state.user = user;
            localStorage.setItem(variables.USER_LOCALSTORAGE, JSON.stringify(user));
        }
    },
})

export const { actions, reducer } = userSlice