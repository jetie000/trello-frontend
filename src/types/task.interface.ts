import { IColumn } from "./column.interface"
import { IUser, IUserResponse } from "./user.interface"

export interface ITask {
    id: number
    name: string
    description?: string
    users: IUserResponse[]
    creationDate: Date
    moveDate: Date
    Column: IColumn
    columnId: number
}

export interface ITaskAddInfo{
    name: string
    description?: string
    columnId: number
    userIds: number[]
}

export interface ITaskUpdateInfo{
    id: number
    name: string
    description?: string
    columnId: number
    userIds: number[]
}