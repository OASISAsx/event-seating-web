"use client";
import { Events } from "@/types/event.interface";
import React, { useEffect, useRef, useState } from "react";
import ImageUpload from "../ImageUpload";
import { useEvent } from "@/store/event.store";

type Props = {
  dialog: boolean;
  onClose: () => void;
  fetchData: Events | null;
};

export default function DialogCreateUpdate({
  dialog,
  onClose,
  fetchData,
}: Props) {
  // const { createEvent } = useEvent();
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageEvent: "",
    location: "",
    startDate: "",
    endDate: "",
    seatsPerRow: 0,
    totalSeats: 0,
  });
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return console.log(form, "form");
    // await createEvent();
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (dialog) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialog]);

  const closeDialog = () => {
    dialogRef.current?.close();
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box relative rounded-2xl bg-neutral">
        {/* Close button (top right) */}
        <button
          onClick={closeDialog}
          className=" cursor-pointer absolute right-3 top-3"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="font-bold text-xl mb-4">
          {fetchData ? "Edit Event" : "Create Event"}
        </h3>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <ImageUpload />

            <input
              type="text"
              placeholder="Event Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="input input-bordered w-full"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="textarea textarea-bordered w-full bg-white text-black"
            />
          </div>

          <div className="modal-action mt-6">
            <button type="button" className="btn" onClick={closeDialog}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              {fetchData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
