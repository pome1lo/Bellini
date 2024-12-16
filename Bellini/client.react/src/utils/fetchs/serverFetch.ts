export const serverFetch  = async (endpoint: string, options?: RequestInit): Promise<Response> => {
    const baseUrl = import.meta.env.VITE_APP_SERVER_URL || "/apigateway";
    console.warn(baseUrl);

    if (!baseUrl) {
        throw new Error("VITE_APP_SERVER_URL is not defined in the environment variables.");
    }


    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, options);

    console.warn(response.status);

    switch (response.status) {
        //case 401: window.location.href = '/login'; return response;
        case 404: window.location.href = '/404'; return response;
        //case 500: window.location.href = '/500'; return response;
    }

    return response;
};