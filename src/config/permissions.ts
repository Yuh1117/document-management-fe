export const ALL_MODULES = {
    USERS: "USERS",
    ROLES: "ROLES",
    PERMISSIONS: "PERMISSIONS",
    DOCUMENTS: "DOCUMENTS",
    FOLDERS: "FOLDERS",
    SETTINGS: "SETTINGS"
}

export const ALL_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE"
}

export const ALL_PERMISSIONS = {
    USERS: {
        CREATE: { name: "Tạo mới người dùng", apiPath: "/api/admin/users", method: "POST", module: "USERS" },
        LIST: { name: "Lấy danh sách người dùng", apiPath: "/api/admin/users", method: "GET", module: "USERS" },
        DETAIL: { name: "Lấy chi tiết người dùng", apiPath: "/api/admin/users/{id}", method: "GET", module: "USERS" },
        UPDATE: { name: "Cập nhật người dùng", apiPath: "/api/admin/users/{id}", method: "PATCH", module: "USERS" },
        DELETE: { name: "Xóa người dùng", apiPath: "/api/admin/users/{id}", method: "DELETE", module: "USERS" }
    },
    ROLES: {
        CREATE: { name: "Tạo vai trò", apiPath: "/api/admin/roles", method: "POST", module: "ROLES" },
        LIST: { name: "Lấy danh sách vai trò", apiPath: "/api/admin/roles", method: "GET", module: "ROLES" },
        DETAIL: { name: "Lấy chi tiết vai trò", apiPath: "/api/admin/roles/{id}", method: "GET", module: "ROLES" },
        UPDATE: { name: "Cập nhật vai trò", apiPath: "/api/admin/roles/{id}", method: "PATCH", module: "ROLES" },
        DELETE: { name: "Xóa vai trò", apiPath: "/api/admin/roles/{id}", method: "DELETE", module: "ROLES" }
    },
    PERMISSIONS: {
        CREATE: { name: "Tạo mới quyền", apiPath: "/api/admin/permissions", method: "POST", module: "PERMISSIONS" },
        LIST: { name: "Lấy danh sách quyền", apiPath: "/api/admin/permissions", method: "GET", module: "PERMISSIONS" },
        DETAIL: { name: "Lấy chi tiết quyền", apiPath: "/api/admin/permissions/{id}", method: "GET", module: "PERMISSIONS" },
        UPDATE: { name: "Cập nhật quyền", apiPath: "/api/admin/permissions/{id}", method: "PATCH", module: "PERMISSIONS" },
        DELETE: { name: "Xóa quyền", apiPath: "/api/admin/permissions/{id}", method: "DELETE", module: "PERMISSIONS" }
    },
    SETTINGS: {
        CREATE: { name: "Tạo mới cài đặt", apiPath: "/api/admin/settings", method: "POST", module: "SETTINGS" },
        LIST: { name: "Lấy danh sách cài đặt", apiPath: "/api/admin/settings", method: "GET", module: "SETTINGS" },
        DETAIL: { name: "Lấy chi tiết cài đặt", apiPath: "/api/admin/settings/{id}", method: "GET", module: "SETTINGS" },
        UPDATE: { name: "Cập nhật cài đặt", apiPath: "/api/admin/settings/{id}", method: "PATCH", module: "SETTINGS" },
        DELETE: { name: "Xóa cài đặt", apiPath: "/api/admin/settings/{id}", method: "DELETE", module: "SETTINGS" }
    }
}