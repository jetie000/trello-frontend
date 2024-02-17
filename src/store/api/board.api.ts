import { baseApi } from './baseApi'
import { IError } from '@/types/error.interface'
import { IBoard, IBoardAddInfo, IBoardUpdateInfo } from '@/types/board.interface'

export const boardApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getBoardById: builder.query<IBoard, number>({
            query: (id: number) => ({
                url: '/board/'+id,
                method: 'GET',
            })
        }),
        getBoardByUserId: builder.query<IBoard[], number>({
            query: (id: number) => ({
                url: '/board/user/'+id,
                method: 'GET',
            })
        }),
        addBoard: builder.mutation<IBoard, IBoardAddInfo>({
            query: (boardInfo: IBoardAddInfo) => ({
                body: boardInfo,
                url: '/board',
                method: 'POST',
            }),
        }),
        changeBoard: builder.mutation<IBoard, IBoardUpdateInfo>({
            query: (boardInfo: IBoardUpdateInfo) => ({
                body: boardInfo,
                url: '/board',
                method: 'PUT',
            }),
        }),
        deleteBoard: builder.mutation<IBoard, number>({
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