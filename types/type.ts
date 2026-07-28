export interface IPermission {
  id: string
  name: string
  apiPath: string
  method: string
  module: string
  createdAt?: string
  updatedAt?: string
}

export interface IRole {
  id: string
  name: string
  description: string
  permissions: IPermission[]
  createdAt?: string
  updatedAt?: string
}

export interface IAccount {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  role: IRole
  createdAt?: string
  updatedAt?: string
}

export interface IUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  avatar: string | File
  role: IRole
  createdAt?: string
  updatedAt?: string
}

export interface ISetting {
  id: string
  key: string
  value: string
  description: string
  createdAt?: string
  updatedAt?: string
  createdBy?: IUser
  updatedBy?: IUser
}

export interface IDocument {
  id: string
  name: string
  description: string
  originalFilename: string
  storedFilename: string
  filePath: string
  fileSize: number
  mimeType: string
  snippet?: string | null
  processingStatus?: 'PROCESSING' | 'COMPLETED' | 'FAILED' | string | null
  deleted: boolean
  folder?: { id: string }
  storageType: string
  createdAt?: string
  updatedAt?: string
  createdBy?: IUser
  updatedBy?: IUser
}

export interface IDocumentSummarize {
  id: string
  summaryText: string
  modelName: string | null
  promptVersion: string | null
}

export interface IFolder {
  id: string
  name: string
  inheritPermissions: boolean
  deleted: boolean
  parent?: { id: string }
  documents?: IDocument[]
  folders?: ISubFolder[]
  createdAt?: string
  updatedAt?: string
  createdBy?: IUser
  updatedBy?: IUser
}

export interface ISubFolder {
  id: string
  name: string
  inheritPermissions: boolean
  isDeleted: boolean
  createdAt?: string
  updatedAt?: string
  createdBy?: IUser
  updatedBy?: IUser
}

export interface IFileItem {
  folder: IFolder
  document: IDocument
  type: string
  permission: string
}

export interface IDocumentShare {
  document: IDocument
  user: IUser
  shareType: string
}

export interface IFolderShare {
  folder: IFolder
  user: IUser
  shareType: string
}

export interface IDocumentVersion {
  id: string
  name: string
  storedFilename: string
  filePath: string
  fileSize: number
  mimeType: string
  versionNumber: number
  document: IDocument
  createdAt?: string
  updatedAt?: string
}

export interface ISummaryFeedbackRes {
  id: string
  documentId: string
  isHelpful: boolean
  comment?: string
  createdAt?: string
}

export interface ISummaryFeedbackDocumentStats {
  documentId: string
  helpfulCount: number
  notHelpfulCount: number
  totalCount: number
}

export interface ISummarizeModel {
  version: string
  modelName: string
  isActive: boolean
  createdAt: string
}

export interface ISummaryFeedbackModelStats {
  modelName: string
  totalCount: number
  helpfulCount: number
  notHelpfulCount: number
}
