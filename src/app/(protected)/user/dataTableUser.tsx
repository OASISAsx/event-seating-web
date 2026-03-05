"use client";
import React, { useEffect } from "react";
import { useRegistration } from "@/store/registration.store";
import { User } from "lucide-react";

export const DataTableUser = () => {
  const { registration, fetchRegistration, loading } = useRegistration();

  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration]);

  const latestFive = registration.slice(-5).reverse();

  return (
    <div className="absolute bottom-0 p-4">
      {loading && <span className="loading loading-ring loading-xl"></span>}

      <p className="font-semibold">การลงทะเบียนล่าสุด</p>

      {latestFive.map((item) => (
        <div
          className="flex items-center gap-2 pt-2 animate-slideDown"
          key={item.id}
        >
          <User size={18} />
          {item.firstName} {item.lastName}
        </div>
      ))}
    </div>
  );
};
