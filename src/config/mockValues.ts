import { IBoard } from "@/types/board.interface"
import { IColumn } from "@/types/column.interface"
import { IUserResponse } from "@/types/user.interface"

export const mockColumn: IColumn = {
  id: 1,
  boardId: 1,
  name: "TODO",
  order: 1,
  tasks: [
    {
      id: 1,
      columnId: 1,
      name: "Task 1",
      creationDate: new Date(0),
      moveDate: new Date(0),
      description: "Description of Task 1",
      users: [
        { id: 1, fullName: "User 1", email: "user1@gmail.com", loginDate: new Date() },
        { id: 2, fullName: "User 2", email: "user2@gmail.com", loginDate: new Date() },
        { id: 3, fullName: "User 3", email: "user3@gmail.com", loginDate: new Date() }
      ],
      Column: {
        id: 1,
        boardId: 1,
        name: "TODO",
        order: 1
      }
    },
    {
      id: 2,
      columnId: 1,
      name: "Task 2",
      creationDate: new Date(),
      moveDate: new Date(),
      description: "Description of Task 2",
      users: [
        { id: 4, fullName: "User 4", email: "user4@gmail.com", loginDate: new Date() },
        { id: 5, fullName: "User 5", email: "user5@gmail.com", loginDate: new Date() }
      ],
      Column: {
        id: 1,
        boardId: 1,
        name: "TODO",
        order: 1
      }
    }
  ]
}

export const mockUsers = [
  {
    id: 1,
    email: "1@gmail.com",
    fullName: "AA AA",
    loginDate: new Date()
  },
  {
    id: 2,
    email: "2@gmail.com",
    fullName: "BB BB",
    loginDate: new Date()
  },
  {
    id: 3,
    email: "3@gmail.com",
    fullName: "CC CC",
    loginDate: new Date()
  }
]
export const mockReturnUsers = (users: IUserResponse[]) => ({
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
  data: users
})
export const mockBoards: IBoard[] = [
  {
    id: 1,
    creatorId: 1,
    name: "Board1",
    columns: [
      mockColumn,
      {
        id: 2,
        boardId: 1,
        name: "PENDING",
        order: 2
      },
      {
        id: 3,
        boardId: 1,
        name: "DONE",
        order: 3
      }
    ]
  },
  {
    id: 2,
    creatorId: 1,
    name: "Board2"
  },
  {
    id: 3,
    creatorId: 1,
    name: "Board3"
  }
]

export const mockReturnMutation = (isLoading: boolean, isPressed: boolean) => ({
  isLoading: isLoading && isPressed,
  isError: false,
  isSuccess: !isLoading && isPressed,
  refetch: jest.fn(),
  reset: jest.fn()
})
