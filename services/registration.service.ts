import { api } from "@/src/lib/axios";
import { CreateRegistration } from "@/types/registration.interface";

export const getRegistrations = async () => {
  const response = await api.get("/registration");
  return response.data;
};

export const createRegistrationSeat = async (payload: CreateRegistration) => {
  const response = await api.post("/registration", {
    payload,
  });

  return response.data;
};
