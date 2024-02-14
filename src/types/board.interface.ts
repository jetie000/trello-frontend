import { IColumn } from "./column.interface"
import { IUser } from "./user.interface"

export interface IBoard {
    id: number
    name: string
    description?: string
    creatorId: number
    columns: IColumn[]
    users: IUser[]
}