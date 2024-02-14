import { IColumn } from "./column.interface"
import { IUser } from "./user.interface"

export interface ITask {
    id: number
    name: string
    description?: string
    users: IUser[]
    creationDate: Date
    moveDate: Date
    Column: IColumn
    columnId: number
}