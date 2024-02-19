import { AuthResponse } from '@/types/authResponse.interface'
import { baseApi } from './baseApi'
import { IUser, IUserChangeInfo, IUserLoginInfo, IUserRegisterInfo, IUserResponse} from '@/types/user.interface'
import { IError } from '@/types/error.interface'

export const userApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getByIds: builder.query<IUserResponse[] | IError, number[]>({
            query: (ids: number[]) => ({
                url: '/user/getByIds/'+ids.join('_'),
                method: 'GET',
            }),
            providesTags: ['Users']
        }),
        getById: builder.query<IUser | IError, number>({
            query: (id: number) => ({
                url: '/user/'+id,
                method: 'GET',
            }),
            providesTags: ['User']
        }),
        logInUser: builder.mutation<AuthResponse | IError, IUserLoginInfo>({
            query: (userInfo: IUserLoginInfo) => ({
                body: userInfo,
                url: '/auth/login',
                method: 'POST',
            })
        }),
        registerUser: builder.mutation<AuthResponse | IError, IUserRegisterInfo>({
            query: (userInfo: IUserRegisterInfo) => ({
                body: userInfo,
                url: '/auth/register',
                method: 'POST',
            }),
        }),
        changeUser: builder.mutation<AuthResponse | IError, IUserChangeInfo>({
            query: (userInfo: IUserChangeInfo) => ({
                body: userInfo,
                url: '/user',
                method: 'PUT',
            }),
            invalidatesTags: ['User', 'Users']
        }),
        logout: builder.mutation<string | IError, null>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        deleteUser: builder.mutation<string | IError, number>({
            query: (userId: number) => ({
                url: '/user/'+userId,
                method: 'DELETE',
            }),
            invalidatesTags: ['User', 'Users']
        }),
        searchUsers: builder.query<IUserResponse[] | IError, string>({
            query: (search: string) => ({
                url: '/user/search/'+search,
                method: "GET"
            }),
            providesTags: ['Users']
        })
    })
})

export const {
    useChangeUserMutation,
    useDeleteUserMutation,
    useGetByIdQuery,
    useGetByIdsQuery,
    useLogInUserMutation,
    useLogoutMutation,
    useRegisterUserMutation,
    useSearchUsersQuery
 } = userApi