import { baseApi } from './baseApi'
import { IError } from '@/types/error.interface'
import { ITask, ITaskAddInfo, ITaskUpdateInfo } from '@/types/task.interface'

export const taskApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        addTask: builder.mutation<ITask, ITaskAddInfo>({
            query: (taskInfo: ITaskAddInfo) => ({
                body: taskInfo,
                url: '/task',
                method: 'POST',
            }),
        }),
        changeTask: builder.mutation<ITask, ITaskUpdateInfo>({
            query: (taskInfo: ITaskUpdateInfo) => ({
                body: taskInfo,
                url: '/task',
                method: 'PUT',
            }),
        }),
        deleteTask: builder.mutation<ITask, number>({
            query: (taskId: number) => ({
                url: '/task/'+taskId,
                method: 'DELETE',
            })
        }),
    })
})

export const {
    useAddTaskMutation,
    useChangeTaskMutation,
    useDeleteTaskMutation,
 } = taskApi