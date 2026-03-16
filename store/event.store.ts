import { EventService, getEventOne } from "@/services/event.service";
import { UseEventsStore } from "@/types/event.interface";
import { create } from "zustand";

export const useEvent = create<UseEventsStore>((set) => ({
  events: [],
  event: null,
  loading: false,

  fetchEvent: async () => {
    set({ loading: true });
    const res = await EventService();

    set({
      events: res.data,
      loading: false,
    });
  },

  getEventById: async (id: string) => {
    set({ loading: true });
    const res = await getEventOne(id);
    set({ event: res.data, loading: false });
  },
}));
