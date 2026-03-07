"use client";
import React, { useEffect } from "react";
import { useRegistration } from "@/store/registration.store";
import { User } from "lucide-react";

export const DataTableUser = () => {
  const { registration, fetchRegistration, loading } = useRegistration();

  useEffect(() => {
    fetchRegistration();
    registration.slice(-5);
  }, [fetchRegistration]);

  return (
    <div>
      {loading && <span className="loading loading-ring loading-xl"></span>}
      <div className="overflow-x-auto bg-neutral">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Event</th>
            </tr>
          </thead>
          {registration.map((item) => (
            <tbody key={item.id} className="text-white">
              <tr className="hover:bg-base-300">
                <td>
                  <p className="flex items-center">
                    <span>
                      <User />
                    </span>
                    {item.firstName} {item.lastName}
                  </p>
                </td>
                <td>{item.event?.name}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};
