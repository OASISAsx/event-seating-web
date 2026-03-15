"use client";
import { useEffect } from "react";

import { Registration } from "@/types/registration.interface";
import { useRegistration } from "@/store/registration.store";
import DataTable from "../../components/Datatable";
import { usePathname } from "next/navigation";

const headers = [
  {
    key: "firstName",
    width: "200px",
    label: "Name",
    color: "black",
  },
  { key: "event.name", width: "200px", label: "Event", color: "black" },
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
    <div className="p-6 bg-primary-content rounded-2xl w-full">
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
