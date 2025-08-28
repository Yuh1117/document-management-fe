import axios from "axios";
import cookies from "react-cookies"

const BASE_URL = 'http://localhost:8080/';

export const endpoints = {
    "login": "/api/login",
    "signup": "/api/signup",
    'profile': '/api/secure/profile',
    "google-login": "/api/auth/google",

    "settings": "/api/admin/settings",
    "settings-detail": (id: string | number) => `/api/admin/settings/${id}`,

    "users": "/api/admin/users",
    "users-detail": (id: string | number) => `/api/admin/users/${id}`,

    "roles": "/api/admin/roles",
    "roles-detail": (id: string | number) => `/api/admin/roles/${id}`,

    "permissions": "/api/admin/permissions",
    "permissions-detail": (id: string | number) => `/api/admin/permissions/${id}`,
    "check-permissions": "/api/secure/check-permissions",

    "my-files": "/api/secure/files/my-files",
    "folder-files": (folderId: string | number) => `/api/secure/files/folders/${folderId}`,
    "trash-files": "/api/secure/files/trash",
    "search-files": "/api/secure/files/search",
    "advanced-search": "/api/secure/files/advanced-search",
    "shared-files": "/api/secure/files/shared",

    "folders": "/api/secure/folders",
    "documents": "/api/secure/documents",
    "folder-restore": "/api/secure/folders/restore",
    "document-restore": "/api/secure/documents/restore",
    "folder-delete-permanent": "/api/secure/folders/permanent",
    "document-delete-permanent": "/api/secure/documents/permanent",
    "files-delete-permanent": "/api/secure/files/permanent",
    "folder-detail": (folderId: string | number) => `/api/secure/folders/${folderId}`,
    "document-detail": (documentId: string | number) => `/api/secure/documents/${documentId}`,

    "upload-multiple-documents": "/api/secure/documents/upload",
    "upload-folder": "api/secure/folders/upload",

    "download-single-document": (documentId: string | number) => `/api/secure/documents/download/${documentId}`,
    "download-multiple-documents": "/api/secure/documents/download/multiple",
    "download-single-folder": (folderId: string | number) => `/api/secure/folders/download/${folderId}`,
    "download-multiple-folders": "/api/secure/folders/download/multiple",
    "download-multiple-files": "/api/secure/files/download/multiple",

    "share-url": "/api/secure/documents/share-url",
    "copy-doc": "/api/secure/documents/copy",
    "move-doc": "/api/secure/documents/move",
    "copy-folder": "/api/secure/folders/copy",
    "move-folder": "/api/secure/folders/move",
    "share-doc": "/api/secure/documents/share",
    "share-folder": "/api/secure/folders/share",
    "share-doc-detail": (documentId: string | number) => `/api/secure/documents/share/${documentId}`,
    "share-folder-detail": (folderId: string | number) => `/api/secure/folders/share/${folderId}`,
    "hide-data": "/api/secure/documents/hide-data",
    "extract-data": "/api/secure/documents/extract-data",
}

export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookies.load('token')}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});