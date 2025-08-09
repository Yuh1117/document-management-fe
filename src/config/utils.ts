import type { IPermission } from "@/types/type";

export function formatTime(time: string | undefined): string {
    if (!time) return "";

    const cleanedDateStr = time.replace(/\.\d+Z$/, 'Z');
    const date = new Date(cleanedDateStr);

    const dateStr = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);

    const timeStr = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(date);

    return `${dateStr} ${timeStr}`;
}

export function getMethodColor(method: string): string {
    switch (method) {
        case "GET":
            return "text-green-500";
        case "POST":
            return "text-yellow-500";
        case "PUT":
            return "text-blue-500";
        case "PATCH":
            return "text-violet-500";
        case "DELETE":
            return "text-red-500";
        default:
            return "text-gray-500";
    }
}

export function groupedPermissions(permissions: IPermission[]) {
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const module = permission.module;
        if (!acc[module]) {
            acc[module] = { module, permissions: [] };
        }
        acc[module].permissions.push(permission);
        return acc;
    }, {} as Record<string, { module: string, permissions: IPermission[] }>);

    return groupedPermissions;
}

// function transformPermissions(groupedPermissions: Record<string, { module: string, permissions: IPermission[] }>) {
//     const transformedPermissions: Record<string, Record<string, { method: string, apiPath: string, module: string }>> = {};

//     for (const module in groupedPermissions) {
//         const modulePermissions = groupedPermissions[module].permissions;

//         transformedPermissions[module] = {};

//         modulePermissions.forEach((permission) => {
//             const { method, apiPath, name } = permission;

//             let action: string;
//             if (method === 'POST') {
//                 if (apiPath.endsWith('/{id}')) {
//                     action = 'CREATE';
//                 } else {
//                     action = 'CREATE';
//                 }
//             } else if (method === 'GET') {
//                 if (apiPath.endsWith('/{id}')) {
//                     action = 'GET';
//                 } else {
//                     action = 'GET_PAGINATE';
//                 }
//             } else if (method === 'PATCH') {
//                 action = 'UPDATE';
//             } else if (method === 'DELETE') {
//                 action = 'DELETE';
//             } else {
//                 action = 'UNKNOWN';
//             }

//             transformedPermissions[module][action] = { method, apiPath, module };
//         });
//     }

//     return transformedPermissions;
// }