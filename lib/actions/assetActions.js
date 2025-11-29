import axiosInstance from '../api/axios';

// Get all media files
export const fetchAllMediaFiles = async () => {
  try {
    const response = await axiosInstance.get('/upload/media');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a media file
export const deleteMediaFile = async (category, filename) => {
  try {
    const response = await axiosInstance.delete(`/upload/media/${category}/${filename}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

