import axios from "axios";
import cookies from "react-cookies"

const BASE_URL = 'http://localhost:8080/';

export const endpoints = {
    "login": "/api/login",
    "signup": "/api/signup",
    'profile': '/api/secure/profile',
    "google-login": "/api/auth/google",

    "settings": "/api/admin/settings",
    "settings-detail": (id: number) => `/api/admin/settings/${id}`,

    "users": "/api/admin/users",
    "users-detail": (id: number) => `/api/admin/users/${id}`,

    "roles": "/api/admin/roles",
    "roles-detail": (id: number) => `/api/admin/roles/${id}`,

    "permissions": "/api/admin/permissions",
    "permissions-detail": (id: number) => `/api/admin/permissions/${id}`,
    "check-permissions": "/api/secure/check-permissions",

    "my-files": "/api/secure/my-files",
    "folder-detail": (folderId: number) => `/api/secure/folders/${folderId}`,
    "document-detail": (documentId: number) => `/api/secure/documents/${documentId}`,
    "download-single-document": (documentId: number) => `/api/secure/documents/download/${documentId}`,
    "download-multiple-documents": "/api/secure/documents/download/multiple"
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