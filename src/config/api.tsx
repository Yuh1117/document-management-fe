import axios from "axios";
import { store } from "@/redux/store";
import { setAccessToken, logout } from "@/redux/reducers/userSlice";

const BASE_URL = import.meta.env.VITE_API_URL;
const LANGUAGE_STORAGE_KEY = "language";

export function getAcceptLanguage(): string {
    if (typeof window === "undefined") return "vi";
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || "vi";
}

export const endpoints = {
    "login": "/api/login",
    "signup": "/api/signup",
    'profile': '/api/secure/profile',
    "google-login": "/api/auth/google",
    "refresh": "/api/auth/refresh",
    "logout": "/api/auth/logout",

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
    "recent-files": "/api/secure/files/recent",

    "folders": "/api/secure/folders",
    "documents": "/api/secure/documents",
    "folder-restore": "/api/secure/folders/restore",
    "document-restore": "/api/secure/documents/restore",
    "folder-delete-permanent": "/api/secure/folders/permanent",
    "document-delete-permanent": "/api/secure/documents/permanent",
    "files-delete-permanent": "/api/secure/files/permanent",
    "folder-detail": (folderId: string | number) => `/api/secure/folders/${folderId}`,
    "document-detail": (documentId: string | number) => `/api/secure/documents/${documentId}`,
    "document-version": (documentId: string | number) => `/api/secure/documents/${documentId}/versions`,
    "document-preview": (documentId: string | number) => `/api/secure/documents/${documentId}/preview`,
    "document-summarize": (documentId: string | number) => `/api/secure/documents/${documentId}/summarize`,

    "upload-multiple-documents": "/api/secure/documents/upload",
    "upload-folder": "api/secure/folders/upload",
    "upload-replace-doc": "/api/secure/documents/upload-replace",
    "upload-keep-doc": "/api/secure/documents/upload-keep",

    "download-single-document": (documentId: string | number) => `/api/secure/documents/download/${documentId}`,
    "download-multiple-documents": "/api/secure/documents/download/multiple",
    "download-single-folder": (folderId: string | number) => `/api/secure/folders/download/${folderId}`,
    "download-multiple-folders": "/api/secure/folders/download/multiple",
    "download-multiple-files": "/api/secure/files/download/multiple",
    "download-document-version": (documentId: string | number, versionId: string | number) => `/api/secure/documents/${documentId}/versions/${versionId}/download`,

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

    "document-summary-feedback": (documentId: string | number) => `/api/secure/documents/${documentId}/summary-feedback`,
    "summary-feedback-stats": "/api/secure/documents/summary-feedback/stats",
    "summarize-models": "/api/admin/documents/summarize/models",
    "summarize-models-reload": "/api/admin/documents/summarize/models/reload",
}

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const isRefreshRequest = config.url?.includes(endpoints["refresh"]);
    if (!isRefreshRequest) {
        const token = store.getState().users.accessToken;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    config.headers["Accept-Language"] = getAcceptLanguage();
    return config;
});

let isRefreshing = false;
let refreshSubscribers: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const notifySubscribers = (token: string) => {
    refreshSubscribers.forEach(({ resolve }) => resolve(token));
    refreshSubscribers = [];
};

const rejectSubscribers = (err: unknown) => {
    refreshSubscribers.forEach(({ reject }) => reject(err));
    refreshSubscribers = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isUnauthorized = error.response?.status === 401;
        const isRefreshEndpoint = originalRequest.url?.includes(endpoints["refresh"]);
        const isPublicEndpoint = [endpoints["login"], endpoints["signup"], endpoints["google-login"]]
            .some(url => originalRequest.url?.includes(url));
        const hasRetried = originalRequest._retry;

        if (!isUnauthorized || isRefreshEndpoint || isPublicEndpoint || hasRetried) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshSubscribers.push({
                    resolve: (token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    },
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const res = await axios.post(
                BASE_URL + endpoints["refresh"],
                {},
                { withCredentials: true, headers: { "Accept-Language": getAcceptLanguage() } }
            );
            const newToken = res.data.data.accessToken;
            store.dispatch(setAccessToken(newToken));
            notifySubscribers(newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            rejectSubscribers(refreshError);
            store.dispatch(logout());
            window.location.href = "/login";
            return Promise.reject(error);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
