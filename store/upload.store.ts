import { uploadImage } from "@/services/upload.service";
import { create } from "zustand";

type UploadStore = {
  loading: boolean;
  imageUrl: string;
  uploadFile: (file: File) => Promise<string>;
  reset: () => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  loading: false,
  imageUrl: "",
  uploadFile: async (file) => {
    set({ loading: true });

    try {
      const imageUrl = await uploadImage(file);
      set({ imageUrl, loading: false });
      return imageUrl;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  reset: () => set({ imageUrl: "", loading: false }),
}));
