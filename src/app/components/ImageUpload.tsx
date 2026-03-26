"use client";

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import Image from "next/image";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "done" | "error";
}

export default function ImageUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, progress: 100, status: "done" } : img,
          ),
        );
      } else {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, progress } : img)),
        );
      }
    }, 200);
  };

  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );

    const newImages: UploadedImage[] = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "uploading",
    }));

    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((img) => simulateUpload(img.id));
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

      {/* File List */}
      {images.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{images.length} ไฟล์</span>
            <button
              onClick={() => {
                images.forEach((img) => URL.revokeObjectURL(img.preview));
                setImages([]);
              }}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              ลบทั้งหมด
            </button>
          </div>

          {images.map((img) => (
            <div
              key={img.id}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 bg-gray-50 group"
            >
              <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                <Image
                  src={img.preview}
                  alt={img.file.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 ">
                <p className="text-sm text-gray-700 truncate leading-tight">
                  {img.file.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${img.status === "done" ? "bg-emerald-400" : "bg-violet-400"}`}
                      style={{ width: `${img.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {img.status === "done"
                      ? formatSize(img.file.size)
                      : `${Math.round(img.progress)}%`}
                  </span>
                </div>
              </div>

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
