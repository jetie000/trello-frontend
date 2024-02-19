import { IBoard } from "./board.interface"
import { ITask } from "./task.interface"

export interface IUser {
    id: number
    email: string
    password: string
    fullName: string
    access: boolean
    refreshToken?: string
    activationLink?: string
    joinDate: Date
    loginDate: Date
    boardsPartipated: IBoard[]
    tasksParticipated: ITask[]
}

export interface IUserRegisterInfo {
    email: string
    password: string
    fullName: string
}

export interface IUserLoginInfo {
    email: string
    password: string
}

export interface IUserChangeInfo {
    id: number
    email: string
    password: string
    oldPassword: string
    fullName: string
}

export interface IUserResponse {
    id: number
    email: string
    fullName: string
    loginDate: Date
    boardsPartipated?: IBoard[]
    tasksParticipated?: ITask[]
}