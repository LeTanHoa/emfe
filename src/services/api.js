import axios from "axios";

const API_URL = "http://localhost:8080/api/images";

export const uploadImage = async (formData) => {
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteImage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting image: " + error.message);
  }
};

export const fetchImages = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
