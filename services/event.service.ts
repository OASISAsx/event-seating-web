import { api } from "@/src/lib/axios";
import { CreateEvent } from "@/types/event.interface";

export const EventService = async () => {
  try {
    const response = await api.get("/events");

    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventOne = async (id: string) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (payload: CreateEvent) => {
  try {
    const response = await api.post(`/events`, { payload });

    return response;
  } catch (error) {
    console.error(`Error create data`, error);
    throw error;
  }
};
