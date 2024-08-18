export const serverFetch  = async (endpoint: string, options?: RequestInit): Promise<Response> => {
    const baseUrl = "https://localhost:7292";
    if (!baseUrl) {
        throw new Error("REACT_APP_SERVER_URL is not defined in the environment variables.");
    }

    const url = `${baseUrl}${endpoint}`;
    console.log(url);
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
};