import apiClient from './apiClient';

export const getProfile = async () => {
    try {
        const response = await apiClient.get('/profile');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await apiClient.put('/profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

const profileServices = {
    getProfile,
    updateProfile
};

export default profileServices;