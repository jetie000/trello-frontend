export interface IUser{
    id: number
    email: string
    saltedPassword: string
    fullName: string
    accessToken: string
    expirationToken: string
    joinDate: Date
    loginDate: Date
}
