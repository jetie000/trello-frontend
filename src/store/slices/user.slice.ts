import { localStorageConfig } from "@/config/localStorage"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface userState {
  token?: string
  id?: number
}

const initialState: userState = {
  token: localStorage.getItem(localStorageConfig.TOKEN_LOCALSTORAGE) || undefined,
  id: Number(localStorage.getItem(localStorageConfig.USERID_LOCALSTORAGE)) || undefined
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem(localStorageConfig.TOKEN_LOCALSTORAGE)
      localStorage.removeItem(localStorageConfig.USERID_LOCALSTORAGE)
      state.token = undefined
      state.id = undefined
    },
    login: (state, { payload: { token, id } }: PayloadAction<userState>) => {
      state.token = token
      state.id = id
      localStorage.setItem(localStorageConfig.TOKEN_LOCALSTORAGE, JSON.stringify(token))
      localStorage.setItem(localStorageConfig.USERID_LOCALSTORAGE, JSON.stringify(id))
    }
  }
})

export const { actions, reducer } = userSlice
