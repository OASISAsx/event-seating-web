"use client";
import { useEffect } from "react";

import { Registration } from "@/types/registration.interface";
import { useRegistration } from "@/store/registration.store";
import DataTable from "../../components/Registration/Datatable";
import { usePathname } from "next/navigation";

const headers = [
  {
    key: "firstName",
    width: "200px",
    label: "First Name",
    color: "white",
  },
  {
    key: "lastName",
    width: "200px",
    label: "Last Name",
    color: "white",
  },
  {
    key: "status",
    width: "150px",
    label: "Status",
    color: "white",
    render: (row: Registration) => {
      const status = row?.status || "PENDING";
      const color = status === "CONFIRMED" ? "green" : "yellow";
      return (
        <span
          className={`badge badge-warning badge-sm text-black bg-${color}-500 border-none`}
        >
          {status}
        </span>
      );
    },
  },
  { key: "event.name", width: "200px", label: "Event", color: "white" },
];

export default function DataTableRegistration() {
  const {
    registration,
    loading,
    total,
    page,
    pageSize,
    search,
    fetchRegistration,
    setPage,
    setPageSize,
  } = useRegistration();

  const pathname = usePathname();

  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration, pathname, page, pageSize, search]);

  return (
    <div className="p-6 bg-base-300 rounded-2xl text-amber-50 w-full">
      <DataTable<Registration>
        headers={headers}
        data={registration}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
