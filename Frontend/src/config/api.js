// API Configuration
// This file provides centralized API URL configuration

// Get the base API URL from environment variables
// In development: uses localhost
// In production: uses the deployed backend URL or relative path
export const getBaseURL = () => {
    // Check if VITE_API_URL is defined in .env
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Fallback: Auto-detect based on environment
    if (import.meta.env.DEV) {
        // Development mode - use localhost
        return 'http://localhost:8080';
    } else {
        // Production mode - use relative path (same origin)
        // This works because Render serves frontend from same domain
        return window.location.origin;
    }
};

// Export the base URL
export const API_BASE_URL = getBaseURL();

// Export API endpoint path
export const API_V1_PATH = '/api/v1';

// Full API URL
export const API_URL = `${API_BASE_URL}${API_V1_PATH}`;

// Helper function to get full endpoint URL
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    // If endpoint already includes /api/v1, use base URL only
    if (cleanEndpoint.startsWith('api/v1')) {
        return `${API_BASE_URL}/${cleanEndpoint}`;
    }

    // Otherwise, add /api/v1 prefix
    return `${API_URL}/${cleanEndpoint}`;
};

// Socket.IO URL (without /api/v1)
export const SOCKET_URL = API_BASE_URL;

export default {
    API_BASE_URL,
    API_URL,
    SOCKET_URL,
    getApiUrl,
};
