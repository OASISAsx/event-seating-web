import { api } from "@/src/lib/axios";

export const getChatMessages = async (roomId: string) => {
  try {
    const response = await api.get(`/chat/rooms/${roomId}/messages`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for room ${roomId}:`, error);
    throw error;
  }
};

export const getChatRoomStats = async (roomId: string) => {
  try {
    const response = await api.get(`/chat/rooms/${roomId}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stats for room ${roomId}:`, error);
    throw error;
  }
};

export const getAdmins = async (currentAdminId: string) => {
  try {
    const response = await api.get(`/auth/admins`, {
      params: { currentAdminId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};
