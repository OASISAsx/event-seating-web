"use client";
import { useEffect } from "react";

import { Registration } from "@/types/registration.interface";
import { useRegistration } from "@/store/registration.store";
import DataTable from "../../components/Registration/Datatable";
import { usePathname } from "next/navigation";
import { useRegistrationSocket } from "../../components/hooks/useRegistrationSocket";
const headers = [
  {
    key: "firstName",
    width: "200px",
    label: "Name",
  },
  // { key: "phone", label: "Phone" },
  // { key: "email", label: "Email" },
  { key: "event.name", width: "200px", label: "Event" },
];

export default function DataTableUser() {
  const {
    registration,
    loading,
    total,
    page,
    pageSize,
    fetchRegistration,
    setPage,
    setPageSize,
  } = useRegistration();

  const pathname = usePathname();
  useRegistrationSocket();
  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration, pathname]);
  return (
    <div className="p-6 bg-neutral">
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
