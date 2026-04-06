import { api } from "@/src/lib/axios";

type UploadResponse =
  | string
  | {
      id?: string;
      url?: string;
      imageUrl?: string;
      filename?: string;
      size?: number;
      secure_url?: string;
      data?: string | { url?: string; imageUrl?: string; secure_url?: string };
    };

const normalizeUploadUrl = (url: string): string => {
  let normalized = url.trim();

  if (normalized.startsWith("http//")) {
    normalized = normalized.replace("http//", "http://");
  }

  if (normalized.startsWith("https//")) {
    normalized = normalized.replace("https//", "https://");
  }

  normalized = normalized.replace(
    /^(https?):\/\/localhost(?=\d)/,
    "$1://localhost:",
  );

  return normalized;
};

const getUploadUrl = (payload: UploadResponse): string => {
  if (typeof payload === "string") {
    return normalizeUploadUrl(payload);
  }

  if (typeof payload.data === "string") {
    return normalizeUploadUrl(payload.data);
  }

  if (payload.url) {
    return normalizeUploadUrl(payload.url);
  }

  if (payload.imageUrl) {
    return normalizeUploadUrl(payload.imageUrl);
  }

  if (payload.secure_url) {
    return normalizeUploadUrl(payload.secure_url);
  }

  if (payload.data && typeof payload.data === "object") {
    if (payload.data.url) {
      return normalizeUploadUrl(payload.data.url);
    }

    if (payload.data.imageUrl) {
      return normalizeUploadUrl(payload.data.imageUrl);
    }

    if (payload.data.secure_url) {
      return normalizeUploadUrl(payload.data.secure_url);
    }
  }

  throw new Error("Upload response does not contain an image URL");
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return getUploadUrl(response.data);
};
