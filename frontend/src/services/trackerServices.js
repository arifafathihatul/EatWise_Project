import { apiClient } from './apiClient';

export const getDashboardSummary = async () => {
    try {
        const response = await apiClient.get('/tracker/dashboard');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

export const getDailyTracker = async () => {
    try {
        const response = await apiClient.get('/tracker');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

export const addToDailyTracker = async (trackerData) => {
    try {
        const response = await apiClient.post('/tracker', trackerData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

