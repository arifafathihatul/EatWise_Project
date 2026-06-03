import { authClient } from './apiClient';

export const register = async (userData) => {
    try {
        const response = await authClient.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

export const login = async (email, password) => {
    try {
        const response = await authClient.post('/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

const authService = {
    register,
    login
};

export default authService;