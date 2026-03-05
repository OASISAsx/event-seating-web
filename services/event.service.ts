import { api } from "@/src/lib/axios";

export const EventService = async () => {
  const response = await api.get("/events");

  return response;
};
