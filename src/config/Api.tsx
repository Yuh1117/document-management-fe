import axios from "axios";
import cookies from "react-cookies"

const BASE_URL = 'http://localhost:8080/';

export const endpoints = {
    "login": "/api/login",
    "signup": "/api/signup",
    'profile': '/api/secure/profile',
    "google-login": "/api/auth/google",
    
    "settings": "/api/secure/settings",
    "settings-detail": (id: number) => `/api/secure/settings/${id}`,
    
    "users": "/api/secure/users",
    "users-detail": (id: number) => `/api/secure/users/${id}`,
    
    "roles": "/api/secure/roles",
    "roles-detail": (id: number) => `/api/secure/roles/${id}`,
    
    "permissions": "/api/secure/permissions",
    "permissions-detail": (id: number) => `/api/secure/permissions/${id}`,
    "permissions-all": "/api/secure/permissions-all",
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