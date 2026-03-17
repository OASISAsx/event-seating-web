import {
  createRegistrationSeat,
  getRegistrations,
  getRegistrationsByEvent,
} from "@/services/registration.service";
import { Toast } from "@/src/lib/toast";
import { PaginationParams } from "@/types/paginationParams";
import {
  Registration,
  useRegistrationStore,
} from "@/types/registration.interface";
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
  requestId: null,
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
    const currentRequestId = Date.now(); // 🔥 กัน race condition
    set({ loading: true, error: "", requestId: currentRequestId });

    try {
      const params = get()._getParams();
      const res = await getRegistrations(params);

      // ❗ ถ้ามี request ใหม่มาแล้ว → ignore อันเก่า
      if (get().requestId !== currentRequestId) return;

      set({
        registration: res.data,
        total: res.meta.total,
        mainStatus: res.status || {},
      });
    } catch (err) {
      if (get().requestId !== currentRequestId) return;

      set({
        error: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      if (get().requestId === currentRequestId) {
        set({ loading: false });
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

  addRegistration: (item: Registration) => {
    set((state) => {
      const exists = state.registration.some((i) => i.id === item.id);
      if (exists) return state;

      if (state.page !== 1) return state;

      return {
        registration: [item, ...state.registration],
        total: state.total + 1,
      };
    });
  },

  createRegistration: async (payload) => {
    try {
      set({ loading: true, error: "" });

      const res = await createRegistrationSeat(payload);

      if (!res.success) {
        throw new Error("Create registration failed");
      }

      const newItem = res.data;

      // 🔥 ใช้ function กลาง (DRY)
      get().addRegistration(newItem);

      Toast.success("ลงทะเบียนสำเร็จ");

      return newItem;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Something went wrong",
        loading: false,
      });
      Toast.error(get().error || "Something went wrong");

      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
