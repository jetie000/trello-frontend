import { AuthResponse } from '@/types/authResponse.interface'
import { baseApi } from './baseApi'
import { IUserChangeInfo, IUserLoginInfo, IUserRegisterInfo, IUserResponse} from '@/types/user.interface'

export const userApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getByIds: builder.query<IUserResponse[], string>({
            query: (ids: string) => ({
                url: '/user/getByIds?ids='+ids,
                method: 'POST',
            })
        }),
        getById: builder.query<AuthResponse | string, number>({
            query: (id: number) => ({
                url: '/user/getById?id='+id,
                method: 'POST',
            })
        }),
        logInUser: builder.mutation<AuthResponse | string, IUserLoginInfo>({
            query: (userInfo: IUserLoginInfo) => ({
                body: userInfo,
                url: '/auth/login',
                method: 'POST',
            })
        }),
        registerUser: builder.mutation<AuthResponse | string, IUserRegisterInfo>({
            query: (userInfo: IUserRegisterInfo) => ({
                body: userInfo,
                url: '/auth/register',
                method: 'POST',
            }),
        }),
        changeUser: builder.mutation<AuthResponse | string, IUserChangeInfo>({
            query: (userInfo: IUserChangeInfo) => ({
                body: userInfo,
                url: '/user',
                method: 'PUT',
            }),
        }),
        logout: builder.mutation<string, null>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        deleteUser: builder.mutation<string, number>({
            query: (userId: number) => ({
                url: '/user/'+userId,
                method: 'DELETE',
            })
        }),
    })
})

export const { } = userApi