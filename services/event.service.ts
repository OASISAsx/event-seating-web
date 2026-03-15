import { api } from "@/src/lib/axios";

export const EventService = async () => {
  try {
    const response = await api.get("/events");

    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
