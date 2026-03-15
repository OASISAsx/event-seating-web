import { api } from "@/src/lib/axios";
import { CreateRegistration } from "@/types/registration.interface";

export const getRegistrations = async (params: URLSearchParams) => {
  try {
    const response = await api.get(`/registration?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error;
  }
};

export const createRegistrationSeat = async (payload: CreateRegistration) => {
  try {
    const response = await api.post("/registration", {
      payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating registration:", error);
    throw error;
  }
};
