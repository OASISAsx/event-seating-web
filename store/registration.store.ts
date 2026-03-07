import {
  createRegistrationSeat,
  getRegistrations,
} from "@/services/registration.service";
import { Toast } from "@/src/lib/toast";
import { useRegistrationStore } from "@/types/registration.interface";
import { create } from "zustand";

export const useRegistration = create<useRegistrationStore>((set) => ({
  registration: [],
  loading: false,
  error: null,
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
      console.log(res.success, "success");
      if (res.success) {
        Toast.success("ลงทะเบียนสำเร็จ");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || "เกิดข้อผิดพลาด";

      Toast.error(message);

      set({
        loading: false,
        error: message,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
