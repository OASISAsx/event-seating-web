"use client";

import { useEvent } from "@/store/event.store";
import React, { useEffect } from "react";
import Chat from "./chat";
const headers = [
  { key: "name", label: "Event Name", width: "30%" },
  {
    key: "startDate",
    label: "Start Date",
    width: "20%",
    render: (row: { startDate: string }) =>
      new Date(row.startDate).toLocaleDateString(),
  },
  {
    key: "endDate",
    label: "End Date",
    width: "20%",
    render: (row: { endDate: string }) =>
      new Date(row.endDate).toLocaleDateString(),
  },
  { key: "location", label: "Location", width: "30%" },
];
export default function AddEventPage() {
  const { events, fetchEvent, loading } = useEvent();

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);
  return (
    <div className="p-4">
      <Chat />
    </div>
  );
}
