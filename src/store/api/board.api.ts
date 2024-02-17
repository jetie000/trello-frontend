import { baseApi } from './baseApi'
import { IError } from '@/types/error.interface'
import { IBoard, IBoardAddInfo, IBoardUpdateInfo } from '@/types/board.interface'

export const boardApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getBoardById: builder.query<IBoard | IError, number>({
            query: (id: number) => ({
                url: '/board/'+id,
                method: 'GET',
            })
        }),
        getBoardByUserId: builder.query<IBoard[] | IError, number>({
            query: (id: number) => ({
                url: '/board/user/'+id,
                method: 'GET',
            })
        }),
        addBoard: builder.mutation<IBoard | IError, IBoardAddInfo>({
            query: (boardInfo: IBoardAddInfo) => ({
                body: boardInfo,
                url: '/board',
                method: 'POST',
            }),
        }),
        changeBoard: builder.mutation<IBoard | IError, IBoardUpdateInfo>({
            query: (boardInfo: IBoardUpdateInfo) => ({
                body: boardInfo,
                url: '/board',
                method: 'PUT',
            }),
        }),
        deleteBoard: builder.mutation<IBoard | IError, number>({
            query: (boardId: number) => ({
                url: '/board/'+boardId,
                method: 'DELETE',
            })
        }),
    })
})

export const {
    useAddBoardMutation,
    useChangeBoardMutation,
    useDeleteBoardMutation,
    useGetBoardByIdQuery,
    useGetBoardByUserIdQuery
 } = boardApi