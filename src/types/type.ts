export interface IPermission {
    id: number,
    name: string,
    apiPath: string,
    method: string,
    module: string
}

export interface IRole {
    id: number,
    name: string,
    description: string
    permissions: IPermission[]
}

export interface IUser {
    id: number;
    email: string,
    firstName: string,
    lastName: string,
    avatar: string,
    role: IRole
}

export interface ISetting {
    id: number,
    key: string,
    value: string,
    description: string
    createdAt?: string,
    updatedAt?: string,
    createdBy?: IUser,
    updatedBy?: IUser,
}

