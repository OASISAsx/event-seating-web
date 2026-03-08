import {
  createRegistrationSeat,
  getRegistrations,
} from "@/services/registration.service";
import { Toast } from "@/src/lib/toast";
import { PaginationParams } from "@/types/paginationParams";
import { useRegistrationStore } from "@/types/registration.interface";
import { create } from "zustand";
const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  pageSize: 10,
  search: "",
};

export const useRegistration = create<useRegistrationStore>((set, get) => ({
  // State
  registration: [],
  total: 0,
  loading: false,
  error: "",
  ...DEFAULT_PAGINATION,

  // ── Pagination setters (แต่ละตัว reset page กลับ 1 เมื่อ filter เปลี่ยน) ──

  setPage: (page) => {
    set({ page });
    get().fetchRegistration();
  },

  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().fetchRegistration();
  },

  reset: () =>
    set({ ...DEFAULT_PAGINATION, registration: [], total: 0, error: "" }),

  _getParams: () => {
    const { page, pageSize, search } = get();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });

    if (search) params.set("search", search);
    return params;
  },

  // ── Fetch ─────────────────────────────────────────────────────────────────

  fetchRegistration: async () => {
    set({ loading: true, error: "" });
    try {
      const params = get()._getParams();
      const res = await getRegistrations(params);
      set({
        registration: res.data,
        total: res.meta.total,
        loading: false,
      });
    } catch (err) {
      if (err) {
        set({
          error: err instanceof Error ? err.message : "Something went wrong",
          loading: false,
        });
      }
    }
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
      await get().fetchRegistration();
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
