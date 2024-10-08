import {serverFetch} from "@/utils/fetch's/serverFetch.ts";

export const authFetch = async (
    endpoint: string,
    getAccessToken: () => Promise<string | null>,
    logout: () => void,
    options?: RequestInit
): Promise<Response> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            // Токен не удалось получить или обновить, перенаправляем на страницу логина
            logout();
            window.location.href = '/login';
            return Promise.reject(new Error("Access token is missing, redirecting to login."));
        }

        const authHeaders = {
            'Authorization': `Bearer ${accessToken}`,
            ...options?.headers,
        };

        const authOptions: RequestInit = {
            ...options,
            headers: authHeaders,
        };

        return await serverFetch(endpoint, authOptions);
    } catch (error) {
        logout();
        window.location.href = '/login';
        return Promise.reject(new Error("Failed to fetch, redirecting to login."));
    }
};
