import * as process from "process";

export const serverFetch  = async (endpoint: string, options?: RequestInit): Promise<Response> => {
    const baseUrl = process.env.REACT_APP_SERVER_URL;

    if (!baseUrl) {
        throw new Error("REACT_APP_SERVER_URL is not defined in the environment variables.");
    }

    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
};