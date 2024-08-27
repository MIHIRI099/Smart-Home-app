// Import necessary functions
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './tokenService';

// Define the base URL for API requests
const API_BASE_URL = 'http://192.168.8.101:8000';

// Define a type for the data argument
type RequestData = Record<string, any> | null;

// Define a type for the headers object
type HeadersObject = {
    [key: string]: string;
};

// Function to refresh the access token
async function refreshAccessToken(): Promise<string> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) {
        await clearTokens();
        throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    await saveTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
}

// Function to make an API request
export async function apiRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data: RequestData = null,
    authRoute: boolean = false
): Promise<any> {
    let url = `${API_BASE_URL}${endpoint}`;
    let headers: HeadersObject = {};

    if (authRoute) {
        const accessToken = await getAccessToken();
        if (!accessToken) throw new Error('No access token available');
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (data) {
        if (method.toUpperCase() === 'GET') {
            // Attach data as query parameters for GET requests
            const queryParams = new URLSearchParams(data as Record<string, string>).toString();
            url += `?${queryParams}`;
        }
    }

    // Add content type header if data is being sent
    if (data && method.toUpperCase() !== 'GET') {
        headers['Content-Type'] = 'application/json';
    }

    const options: RequestInit = {
        method: method.toUpperCase(),
        headers: headers as HeadersInit,
        body: data && method.toUpperCase() !== 'GET' ? JSON.stringify(data) : undefined,
    };

    try {
        let response = await fetch(url, options);

        // If the token is expired, try refreshing it
        if (response.status === 401 && authRoute) {
            console.log('Token expired, trying to refresh...');
            const newAccessToken = await refreshAccessToken();
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            options.headers = headers as HeadersInit;
            response = await fetch(url, options); // Retry the original request
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in API request:', error);
        throw error;
    }
}
