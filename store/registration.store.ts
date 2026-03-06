import {
  createRegistrationSeat,
  getRegistrations,
} from "@/services/registration.service";
import { useRegistrationStore } from "@/types/registration.interface";
import { create } from "zustand";

export const useRegistration = create<useRegistrationStore>((set) => ({
  registration: [],
  loading: false,
  fetchRegistration: async () => {
    set({ loading: true });

    const res = await getRegistrations();

    set({
      registration: res.data,
      loading: false,
    });
  },

  createRegistration: async (payload) => {
    try {
      set({ loading: true });

      const res = await createRegistrationSeat(payload);

      set({ registration: res.data });
    } finally {
      set({ loading: false });
    }
  },
}));
