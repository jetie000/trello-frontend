import { IBoard } from "./board.interface"
import { ITask } from "./task.interface"

export interface IColumn {
    id: number
    name: string
    order: number
    board: IBoard
    boardId: number
    tasks: ITask[]
}