import { api } from "@/src/lib/axios";
import {
  CreateRegistration,
  UpdateRegistrationSeatPayload,
} from "@/types/registration.interface";

export const getRegistrations = async (params: URLSearchParams) => {
  try {
    const response = await api.get(`/registration?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error;
  }
};

export const getRegistrationsByEvent = async (eventId: string) => {
  try {
    const response = await api.get(`/registration/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching registrations for event ID ${eventId}:`,
      error,
    );
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

export const updateRegistrationSeat = async (
  registrationId: string,
  payload: UpdateRegistrationSeatPayload,
) => {
  try {
    const response = await api.patch(`/registration/${registrationId}`, payload);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating registration seat for registration ID ${registrationId}:`,
      error,
    );
    throw error;
  }
};
