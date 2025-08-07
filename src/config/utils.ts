export function formatVietnameTime(time: string): string {
    const cleanedDateStr = time.replace(/\.\d+Z$/, 'Z');
    const date = new Date(cleanedDateStr);

    const vietnamTime = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);

    return vietnamTime;
}