import { EventService } from "@/services/event.service";
import { UseEventsStore } from "@/types/event.interface";
import { create } from "zustand";

export const useEvent = create<UseEventsStore>((set) => ({
  events: [],
  loading: false,

  fetchEvent: async () => {
    set({ loading: true });
    const res = await EventService();

    set({
      events: res.data,
      loading: false,
    });
  },
}));
