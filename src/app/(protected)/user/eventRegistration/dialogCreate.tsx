"use client";

import { useRegistration } from "@/store/registration.store";
import { Toast } from "@/src/lib/toast";
import { Events } from "@/types/event.interface";
import React, { useState } from "react";

type Props = {
  dialog: boolean;
  onClose: () => void;
  fetchData: Events | null;
};

type FormPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventId: string | undefined;
};

type FormErrors = Record<keyof Omit<FormPayload, "eventId">, string>;

const getInitialPayload = (eventId?: string): FormPayload => ({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  eventId,
});

const initialErrors: FormErrors = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

export default function DialogCreate({ dialog, onClose, fetchData }: Props) {
  const [payload, setPayload] = useState<FormPayload>(() =>
    getInitialPayload(fetchData?.id),
  );
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const { createRegistration, fetchRegistration } = useRegistration();

  if (!dialog) return null;

  const resetForm = () => {
    setPayload(getInitialPayload(fetchData?.id));
    setErrors(initialErrors);
  };

  const validateField = (
    name: keyof Omit<FormPayload, "eventId">,
    value: string,
  ) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      switch (name) {
        case "firstName":
          return "First name is required";
        case "lastName":
          return "Last name is required";
        case "phone":
          return "Phone is required";
        case "email":
          return "Email is required";
      }
    }

    if (name === "email" && !/\S+@\S+\.\S+/.test(trimmedValue)) {
      return "Email is invalid";
    }

    return "";
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {
      firstName: validateField("firstName", payload.firstName),
      lastName: validateField("lastName", payload.lastName),
      phone: validateField("phone", payload.phone),
      email: validateField("email", payload.email),
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof Omit<FormPayload, "eventId">;

    setPayload((prev) => ({
      ...prev,
      [name]: value,
      eventId: fetchData?.id,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      Toast.error("Please fill in required fields");
      return;
    }

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
      <div className="modal-box bg-neutral w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl flex flex-col">
        <h3 className="font-bold text-lg ">{fetchData?.name}</h3>
        <div className="divider divider-start"></div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="grid md:grid-cols-2 xs:grid-cols-1 gap-x-4 gap-y-6">
            <div>
              <input
                name="firstName"
                className={`input w-full ${errors.firstName ? "input-error" : ""}`}
                value={payload.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-error">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                name="lastName"
                className={`input w-full ${errors.lastName ? "input-error" : ""}`}
                value={payload.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-error">{errors.lastName}</p>
              )}
            </div>

            <div>
              <input
                className={`input w-full ${errors.phone ? "input-error" : ""}`}
                value={payload.phone}
                type="tel"
                onChange={handleChange}
                placeholder="Phone"
                name="phone"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-error">{errors.phone}</p>
              )}
            </div>

            <div>
              <input
                className={`input w-full ${errors.email ? "input-error" : ""}`}
                value={payload.email}
                type="email"
                onChange={handleChange}
                placeholder="Email"
                name="email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="pt-10">
            <p className="text-gray-500 text-xs">
              <span className="text-error">*</span>
              ระบบจะส่งหมายเลขที่นั่งไปยังอีเมลหลังลงทะเบียนสำเร็จ
            </p>
          </div>

          <div className="modal-action mt-auto pt-10">
            <button
              type="submit"
              className="btn btn-success text-white rounded-3xl"
            >
              Register Event
            </button>

            <button
              type="button"
              className="btn btn-ghost rounded-3xl"
              onClick={closeDialog}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
