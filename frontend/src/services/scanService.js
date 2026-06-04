import apiClient from './apiClient';

export const scanFood = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile); 
        const response = await apiClient.post('/scan', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};