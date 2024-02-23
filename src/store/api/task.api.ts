import { baseApi } from "./baseApi"
import { IError } from "@/types/error.interface"
import { ITask, ITaskAddInfo, ITaskUpdateInfo } from "@/types/task.interface"

export const taskApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    addTask: builder.mutation<ITask | IError, ITaskAddInfo>({
      query: (taskInfo: ITaskAddInfo) => ({
        body: taskInfo,
        url: "/task",
        method: "POST"
      }),
      invalidatesTags: ["Board"]
    }),
    changeTask: builder.mutation<ITask | IError, ITaskUpdateInfo>({
      query: (taskInfo: ITaskUpdateInfo) => ({
        body: taskInfo,
        url: "/task",
        method: "PUT"
      }),
      invalidatesTags: ["Board"]
    }),
    deleteTask: builder.mutation<ITask | IError, { taskId: number; boardId: number }>({
      query: ({ taskId, boardId }) => ({
        url: "/task/" + taskId + "/board/" + boardId,
        method: "DELETE"
      }),
      invalidatesTags: ["Board"]
    })
  })
})

export const { useAddTaskMutation, useChangeTaskMutation, useDeleteTaskMutation } = taskApi
