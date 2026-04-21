"use client";

import { Toast } from "@/src/lib/toast";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Props = {
  value: string;
  fileName?: string;
  uploading?: boolean;
  onSelect: (file: File | null) => void;
};

export default function ImageUpload({
  value,
  fileName,
  uploading = false,
  onSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const normalizePreviewUrl = (url: string) => {
    if (url.startsWith("http//")) {
      return url.replace("http//", "http://");
    }

    if (url.startsWith("https//")) {
      return url.replace("https//", "https://");
    }

    return url;
  };

  const remotePreview = useMemo(() => normalizePreviewUrl(value), [value]);
  const localPreview = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : ""),
    [selectedFile],
  );
  const preview = localPreview || remotePreview;
  const displayFileName = selectedFile?.name || fileName || remotePreview;

  useEffect(() => {
    return () => {
      if (localPreview.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const setFileSelection = (file: File) => {
    if (!file.type.startsWith("image/")) {
      Toast.error("Please select an image file");
      return;
    }

    onSelect(file);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileSelection(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    setFileSelection(file);
  };

  const handleRemove = () => {
    onSelect(null);
  };

  return (
    <div className="w-full max-w-sm">
      {/* Drop Zone */}
      {images.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200 group
          ${
            isDragging
              ? "border-violet-400 bg-violet-50"
              : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
          }
        `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleChange}
          />

          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 transition-colors duration-200
          ${isDragging ? "bg-violet-100" : "bg-gray-100 group-hover:bg-violet-50"}`}
          >
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${isDragging ? "text-violet-500" : "text-gray-400 group-hover:text-violet-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <p className="text-sm text-gray-500">
            {isDragging ? (
              <span className="text-violet-500 font-medium">
                วางไฟล์ที่นี่...
              </span>
            ) : (
              <>
                <span className="text-gray-700 font-medium">
                  คลิกเพื่อเลือก
                </span>{" "}
                หรือลากมาวาง
              </>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF</p>
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <div className="relative h-48 w-full overflow-hidden rounded-xl border border-base-content/10 bg-base-200">
            <img
              src={preview}
              alt={localFileName || "event image"}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm text-base-content/70">
              {uploading ? "Uploading..." : localFileName || value}
            </span>

              <button
                onClick={() => removeImage(img.id)}
                className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}

          {/* {images.some((img) => img.status === "done") && (
            <button className="w-full py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors">
              อัปโหลด {images.filter((i) => i.status === "done").length} รูป
            </button>
          )} */}
        </div>
      )}
    </div>
  );
}
