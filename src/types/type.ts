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

export interface IDocument {
    id: number,
    name: string,
    description: string,
    originalFilename: string,
    storedFilename: string,
    filePath: string,
    fileSize: number,
    mimeType: string,
    storageType: string,
    createdAt?: string,
    updatedAt?: string,
    createdBy?: IUser,
    updatedBy?: IUser,
}

export interface IFolder {
    id: number,
    name: string,
    inheritPermissions: boolean,
    isDeleted: boolean,
    documents: IDocument[],
    folders: ISubFolder[],
    createdAt?: string,
    updatedAt?: string,
    createdBy?: IUser,
    updatedBy?: IUser,
}

export interface ISubFolder {
    id: number,
    name: string,
    inheritPermissions: boolean,
    isDeleted: boolean,
    createdAt?: string,
    updatedAt?: string,
    createdBy?: IUser,
    updatedBy?: IUser,
}

export interface IFileItem {
    folder: IFolder,
    document: IDocument
    type: string
}
