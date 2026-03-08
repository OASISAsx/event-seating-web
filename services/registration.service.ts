import { api } from "@/src/lib/axios";
import { CreateRegistration } from "@/types/registration.interface";

export const getRegistrations = async (params: URLSearchParams) => {
  const response = await api.get(`/registration?${params}`);
  return response.data;
};

export const createRegistrationSeat = async (payload: CreateRegistration) => {
  const response = await api.post("/registration", {
    payload,
  });

  return response.data;
};
