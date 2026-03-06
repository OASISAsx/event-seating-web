"use client";
import { createRegistrationSeat } from "@/services/registration.service";
import { Events } from "@/types/event.interface";
import React, { useState } from "react";

type Props = {
  dialog: boolean;
  onClose: () => void;
  fetchData: Events;
};

export default function DialogCreate({ dialog, onClose, fetchData }: Props) {
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    seatId: fetchData.id,
  });
  if (!dialog) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPayload((prve) => ({
      ...prve,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    await createRegistrationSeat(payload);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-900 max-w-2xl h-[45vh] flex flex-col">
        <h3 className="font-bold text-lg">{fetchData?.name}</h3>
        <div className="divider divider-start"></div>

        {/* content */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          <input
            name="firstName"
            className="input w-full col-span-2"
            value={payload.firstName}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <input
            name="lastName"
            className="input w-full"
            value={payload.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <input
            className="input w-full"
            value={payload.phone}
            type="phone"
            onChange={handleChange}
            placeholder="Phone"
            name="phone"
          />
        </div>

        {/* footer */}
        <div className="modal-action mt-auto">
          <button className="btn btn-accent" onClick={handleSubmit}>
            SAVE
          </button>

          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
