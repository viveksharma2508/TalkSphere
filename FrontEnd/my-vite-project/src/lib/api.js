import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export const getMessages = async (token, receiverId = null) => {
  try {
    const response = await api.get('/api/messages', {
      headers: { Authorization: `Bearer ${token}` },
      params: { receiverId },
    });
    return response.data.messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
