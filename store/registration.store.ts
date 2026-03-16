import {
  createRegistrationSeat,
  getRegistrations,
  getRegistrationsByEvent,
} from "@/services/registration.service";
import { Toast } from "@/src/lib/toast";
import { PaginationParams } from "@/types/paginationParams";
import { useRegistrationStore } from "@/types/registration.interface";
import { create } from "zustand";
const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  pageSize: 10,
  search: "",
  status: "",
};

export const useRegistration = create<useRegistrationStore>((set, get) => ({
  // State
  registration: [],
  total: 0,
  registrationByEvent: null,
  loading: false,
  error: "",
  mainStatus: {},
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

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchRegistration();
  },

  setStatus: (status: string) => {
    set({ status, page: 1 });
    get().fetchRegistration();
  },

  reset: () =>
    set({ ...DEFAULT_PAGINATION, registration: [], total: 0, error: "" }),

  _getParams: () => {
    const { page, pageSize, search, status } = get();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });

    if (search) params.set("search", search);
    if (status) params.set("status", status);
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
        mainStatus: res.status || {},
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

  fetchRegistrationByEvent: async (id: string) => {
    try {
      set({ loading: true, error: "" });

      const res = await getRegistrationsByEvent(id);

      console.log("API:", res.data);

      set({
        registrationByEvent: res.data,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Something went wrong",
        loading: false,
      });
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
