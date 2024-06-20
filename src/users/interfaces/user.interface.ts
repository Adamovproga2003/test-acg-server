
export interface IUser {
    user_id: string;
    name: string;
    email: string;
    password: string;
    confirmed: boolean;
    createdAt: Date;
}