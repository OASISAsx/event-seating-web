"use client";
import React, { useState } from "react";

import ActionButtons from "./ActionButtons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DialogCreateUpdate from "./DialogCreateUpdate";
import { Events } from "@/types/event.interface";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColumnDef<T> = {
  key: string;
  label: string;
  width: string;
  color?: string;
  render?: (row: T) => React.ReactNode;
};

export type DataTableProps<T extends { id: string | number }> = {
  headers: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  // pagination จาก store
  //   page: number;
  //   pageSize: number;
  //   total: number;
  //   onPageChange: (page: number) => void;
  //   onPageSizeChange: (size: number) => void;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function getNestedValue<T>(obj: T, key: string): unknown {
  return key.split(".").reduce((acc, k) => {
    if (acc && typeof acc === "object")
      return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj as unknown);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataTableEvent<T extends Events>({
  headers,
  data,
  loading = false,
}: DataTableProps<T>) {
  const { data: session } = useSession();
  const [itemEditing, setItemEditing] = useState<T | null>(null);
  // const route = useRouter();
  const [dialog, setDialog] = useState(false);
  const hasLogin = session?.user;
  const handleEdit = (row: T | null) => {
    setDialog(true);
    setItemEditing(row);
  };

  const handleDelete = (id: string | null) => {
    console.log("delete", id);
  };
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Event List</h1>
          <p className="text-sm opacity-60">Manage your events</p>
        </div>

        <button
          onClick={() => setDialog(true)}
          className="btn btn-primary rounded-xl shadow-md"
        >
          + Add Event
        </button>
      </div>

      {/* Card */}
      <div className="relative bg-base-100 rounded-2xl shadow-lg border border-base-content/5 overflow-hidden">
        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <span className="loading loading-ring loading-lg text-primary" />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200 text-base-content">
              <tr>
                {headers
                  .filter((h) => h.key !== "action")
                  .map((h) => (
                    <th
                      key={h.key}
                      style={{ width: h.width }}
                      className="font-semibold"
                    >
                      {h.label}
                    </th>
                  ))}

                {hasLogin && (
                  <th
                    style={{
                      width:
                        headers.find((h) => h.key === "action")?.width ??
                        "200px",
                    }}
                    className="text-center"
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="text-center py-16 opacity-60"
                  >
                    📭 No events found
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-base-200/60 transition cursor-pointer"
                  >
                    {headers.map((col) => (
                      <td key={col.key} className="py-3">
                        {col.render
                          ? col.render(row)
                          : String(getNestedValue(row, col.key) ?? "-")}
                      </td>
                    ))}

                    {hasLogin && (
                      <td className="text-center">
                        <ActionButtons
                          onEdit={() => handleEdit(row)}
                          onDelete={() => handleDelete(String(row.id))}
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <DialogCreateUpdate
          key={`create-${dialog ? "open" : "closed"}`}
          dialog={dialog}
          onClose={() => setDialog(false)}
          fetchData={itemEditing}
        />
      </div>
    </div>
  );
}
