export interface IPermission {
    id: number,
    name: string,
    apiPath: string,
    method: string,
    module: string,
    createdAt?: string,
    updatedAt?: string,
}

export interface IRole {
    id: number,
    name: string,
    description: string
    permissions: IPermission[],
    createdAt?: string,
    updatedAt?: string,
}

export interface IAccount {
    id: number;
    email: string,
    firstName: string,
    lastName: string,
    avatar: string,
    role: IRole,
    createdAt?: string,
    updatedAt?: string,
}

export interface IUser {
    id: number;
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar: string | File,
    role: IRole,
    createdAt?: string,
    updatedAt?: string,
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

