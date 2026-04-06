"use client";

import ImageUpload from "@/src/app/components/ImageUpload";
import { Toast } from "@/src/lib/toast";
import { useEvent } from "@/store/event.store";
import { useUploadStore } from "@/store/upload.store";
import { Events } from "@/types/event.interface";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  dialog: boolean;
  onClose: () => void;
  fetchData: Events | null;
};

const initialForm = {
  id: "",
  name: "",
  description: "",
  imageEvent: "",
  location: "",
  startDate: "",
  endDate: "",
  seatsPerRow: 0,
  totalSeats: 0,
};

const getFormFromEvent = (event: Events | null) => {
  if (!event) {
    return initialForm;
  }

  return {
    id: event.id,
    name: event.name,
    description: event.description,
    imageEvent: event.imageEvent,
    location: event.location,
    startDate: event.startDate.slice(0, 16),
    endDate: event.endDate.slice(0, 16),
    seatsPerRow: event.seatsPerRow,
    totalSeats: event.totalSeats,
    isActive: event.isActive,
    status: event.status,
  };
};

export default function DialogCreateUpdate({
  dialog,
  onClose,
  fetchData,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { createEvent, loading } = useEvent();
  const {
    uploadFile,
    loading: uploadLoading,
    reset: resetUpload,
  } = useUploadStore();
  const [form, setForm] = useState(() => getFormFromEvent(fetchData));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (dialog) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialog]);

  const closeDialog = () => {
    dialogRef.current?.close();
    setForm(getFormFromEvent(fetchData));
    setSelectedFile(null);
    resetUpload();
    onClose();
  };

  const handleChange = (
    name: keyof typeof initialForm,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name || !form.location || !form.startDate || !form.endDate) {
      Toast.error("Please fill in required fields");
      return;
    }

    if (!form.imageEvent && !selectedFile) {
      Toast.error("Please upload event image");
      return;
    }

    try {
      let imageEvent = form.imageEvent;

      if (selectedFile) {
        imageEvent = await uploadFile(selectedFile);
      }

      await createEvent({
        id: form.id || undefined,
        name: form.name,
        description: form.description,
        imageEvent,
        location: form.location,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        seatsPerRow: Number(form.seatsPerRow),
        totalSeats: Number(form.totalSeats),
      });

      Toast.success(fetchData ? "Event updated" : "Event created");
      setForm(initialForm);
      setSelectedFile(null);
      resetUpload();
      closeDialog();
    } catch {
      Toast.error(fetchData ? "Update event failed" : "Create event failed");
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box relative rounded-2xl bg-neutral max-w-2xl">
        <button
          type="button"
          onClick={closeDialog}
          className="absolute right-3 top-3 cursor-pointer"
        >
          x
        </button>

        <h3 className="mb-4 text-xl font-bold">
          {fetchData ? "Edit Event" : "Create Event"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            value={form.imageEvent}
            fileName={selectedFile?.name}
            uploading={uploadLoading}
            onSelect={(file) => {
              setSelectedFile(file);
              if (!file && !fetchData) {
                handleChange("imageEvent", "");
              }
            }}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Event Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="input input-bordered w-full"
              required
            />

            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="input input-bordered w-full"
              required
            />

            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="input input-bordered w-full"
              required
            />

            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="input input-bordered w-full"
              required
            />

            <input
              type="number"
              min={0}
              placeholder="Seats Per Row"
              value={form.seatsPerRow}
              onChange={(e) =>
                handleChange("seatsPerRow", Number(e.target.value))
              }
              className="input input-bordered w-full"
              required
            />

            <input
              type="number"
              min={0}
              placeholder="Total Seats"
              value={form.totalSeats}
              onChange={(e) =>
                handleChange("totalSeats", Number(e.target.value))
              }
              className="input input-bordered w-full"
              required
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="textarea textarea-bordered min-h-28 w-full bg-white text-black"
          />

          <div className="modal-action mt-6">
            <button type="button" className="btn" onClick={closeDialog}>
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploadLoading}
            >
              {loading || uploadLoading
                ? "Saving..."
                : fetchData
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
