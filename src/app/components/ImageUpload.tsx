"use client";

import { Toast } from "@/src/lib/toast";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

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
  const [localFileName, setLocalFileName] = useState(fileName ?? "");

  const normalizePreviewUrl = (url: string) => {
    if (url.startsWith("http//")) {
      return url.replace("http//", "http://");
    }

    if (url.startsWith("https//")) {
      return url.replace("https//", "https://");
    }

    return url;
  };

  useEffect(() => {
    setPreview(normalizePreviewUrl(value));
  }, [value]);

  useEffect(() => {
    setLocalFileName(fileName ?? "");
  }, [fileName]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const setFilePreview = (file: File) => {
    if (!file.type.startsWith("image/")) {
      Toast.error("Please select an image file");
      return;
    }

    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
    setLocalFileName(file.name);
    onSelect(file);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFilePreview(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    setFilePreview(file);
  };

  const handleRemove = () => {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview("");
    setLocalFileName("");
    onSelect(null);
  };

  return (
    <div className="w-full">
      {!preview && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-violet-400 bg-violet-50"
              : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />

          <p className="text-sm text-gray-500">
            {uploading ? "Uploading image..." : "Click or drag image here"}
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

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                Change
              </button>
              <button
                type="button"
                className="btn btn-sm btn-error btn-outline"
                onClick={handleRemove}
                disabled={uploading}
              >
                Remove
              </button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}
