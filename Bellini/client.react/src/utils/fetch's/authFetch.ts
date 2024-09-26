import { serverFetch } from "@/utils/fetch's/serverFetch.ts";

export const authFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
    const accessToken = sessionStorage.getItem('__access-token');
    const refreshToken = sessionStorage.getItem('__refresh-token');

    if (!accessToken || !refreshToken) {
        window.location.href = '/login';g
        return Promise.reject(new Error("Tokens are missing, redirecting to login."));
    }

    const authHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        ...options?.headers,
    };

    const authOptions: RequestInit = {
        ...options,
        headers: authHeaders,
    };

    const response = await serverFetch(endpoint, authOptions);

    return response;
};
