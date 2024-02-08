import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseApi } from './baseApi'

export const userApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        // logInUser: builder.mutation<IUser | string, IUserLoginInfo>({
        //     query: (userInfo: IUserLoginInfo) => ({
        //         body: userInfo,
        //         url: '/user/login',
        //         method: 'POST',
        //     })
        // }),
        // registerUser: builder.mutation<string, IUserRegisterInfo>({
        //     query: (userInfo: IUserRegisterInfo) => ({
        //         body: userInfo,
        //         url: '/user/register',
        //         method: 'POST',
        //     }),
        // }),
        // changeUser: builder.mutation<string | IUser, IUserChangeInfo>({
        //     query: (userInfo: IUserChangeInfo) => ({
        //         body: userInfo,
        //         url: '/user/changeInfo',
        //         method: 'PUT',
        //     }),
        // }),
        // changeUserAdmin: builder.mutation<string | IUser, IUser>({
        //     query: (user) => ({
        //         body: user,
        //         url: '/user/changeInfoAdmin',
        //         method: 'PUT',
        //     }),
        //     invalidatesTags: () => [{
        //         type: 'Users'
        //     }]
        // }),
        // deleteUser: builder.mutation<string, IUserDeleteInfo>({
        //     query: (userInfo: IUserDeleteInfo) => ({
        //         body: userInfo,
        //         url: '/user/delete',
        //         method: 'DELETE',
        //     }),
        //     invalidatesTags: () => [{
        //         type: 'Users'
        //     }]
        // }),
        // getAll: builder.query<IUser[], {limit: number, contain: string}>({
        //     query: ({limit, contain}) => ({
        //         url: '/user/getAll?contain=' + (contain === '' ? 'no_search_string' : contain)+ '&limit=' + limit,
        //         method: 'GET',
        //     }),
        //     providesTags: () => [{
        //         type: 'Users'
        //     }]
        // }),
    })
})

export const { } = userApi