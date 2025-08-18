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
    "folder-detail": (folderId: string | number) => `/api/secure/folders/${folderId}`,
    "document-detail": (documentId: string | number) => `/api/secure/documents/${documentId}`,
    "upload-multiple-files": "/api/secure/documents/upload",
    "download-single-document": (documentId: string | number) => `/api/secure/documents/download/${documentId}`,
    "download-multiple-documents": "/api/secure/documents/download/multiple",
    "download-single-folder": (folderId: string | number) => `/api/secure/folders/download/${folderId}`,
    "download-multiple-folders": "/api/secure/folders/download/multiple",
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