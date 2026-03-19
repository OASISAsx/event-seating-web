"use client";
import { Events } from "@/types/event.interface";
import React, { useEffect, useRef } from "react";

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
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // ✅ control open/close dialog ด้วย state
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
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Event Name"
            defaultValue={fetchData?.name}
            className="input input-bordered w-full"
          />

          <textarea
            placeholder="Description"
            defaultValue={fetchData?.description}
            className="textarea textarea-bordered w-full"
          />

          <input
            type="date"
            defaultValue={fetchData?.endDate}
            className="input input-bordered w-full"
          />
        </div>

        {/* Actions */}
        <div className="modal-action mt-6">
          <button className="btn" onClick={closeDialog}>
            Cancel
          </button>
          <button className="btn btn-primary">
            {fetchData ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* click outside = close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
