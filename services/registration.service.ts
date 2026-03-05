import { api } from "@/src/lib/axios";

export const getRegistrations = async () => {
  const response = await api.get("/registration");
  return response.data;
};
