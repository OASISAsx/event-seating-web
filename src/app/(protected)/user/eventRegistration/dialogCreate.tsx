"use client";
import { useRegistration } from "@/store/registration.store";
import { Events } from "@/types/event.interface";
import React, { useState } from "react";

type Props = {
  dialog: boolean;
  onClose: () => void;
  fetchData: Events | null;
};

export default function DialogCreate({ dialog, onClose, fetchData }: Props) {
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    eventId: fetchData?.id,
  });
  const { createRegistration, fetchRegistration } = useRegistration();
  if (!dialog) return null;
  const resetForm = () => {
    setPayload({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      eventId: fetchData?.id,
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPayload((prve) => ({
      ...prve,
      [name]: value,
      eventId: fetchData?.id,
    }));
  };

  const handleSubmit = async () => {
    await createRegistration(payload);
    resetForm();
    onClose();
  };

  const closeDialog = async () => {
    resetForm();
    fetchRegistration();
    onClose();
  };

  return (
    <dialog className="modal modal-open ">
      <div className="modal-box w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl  flex flex-col">
        <h3 className="font-bold text-lg">{fetchData?.name}</h3>
        <div className="divider divider-start"></div>

        <div className="grid md:grid-cols-2 xs:grid-cols-1 gap-x-4 gap-y-10">
          <input
            name="firstName"
            className="input w-full"
            value={payload.firstName}
            onChange={handleChange}
            required
            placeholder="Full Name"
          />
          <input
            name="lastName"
            className="input w-full"
            value={payload.lastName}
            onChange={handleChange}
            required
            placeholder="Last Name"
          />
          <input
            className="input w-full"
            value={payload.phone}
            type="phone"
            onChange={handleChange}
            placeholder="Phone"
            required
            name="phone"
          />
          <input
            className="input w-full"
            value={payload.email}
            type="phone"
            onChange={handleChange}
            placeholder="Email"
            required
            name="email"
          />
        </div>

        <div className="pt-10">
          <p className="text-gray-500 text-xs">
            <span className="text-error">*</span>
            เมื่อลงทะเบียนแล้วระบบจะส่งหมายเลขที่นั่งไปยัง Email
          </p>
        </div>

        <div className="modal-action mt-auto pt-10">
          <button
            className="btn btn-success text-white rounded-3xl"
            onClick={handleSubmit}
          >
            Register Event
          </button>

          <button className="btn btn-ghost rounded-3xl" onClick={closeDialog}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
