"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColumnDef<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export type DataTableProps<T extends { id: string | number }> = {
  headers: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  // pagination จาก store
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function getNestedValue<T>(obj: T, key: string): unknown {
  return key.split(".").reduce((acc, k) => {
    if (acc && typeof acc === "object")
      return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj as unknown);
}

function buildPageRange(page: number, totalPages: number): (number | "...")[] {
  const delta = 2;
  const range: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - delta && i <= page + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }
  return range;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataTable<T extends { id: string | number }>({
  headers,
  data,
  loading = false,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = buildPageRange(page, totalPages);

  return (
    <div className="flex flex-col gap-3 ">
      {/* Table */}
      <div className="overflow-x-auto bg-neutral rounded-lg relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral/60 rounded-lg">
            <span className="loading loading-ring loading-md" />
          </div>
        )}

        <table className="table w-full">
          <thead>
            <tr>
              {headers.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center text-white py-6"
                >
                  No data
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-base-300 text-white">
                  {headers.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row)
                        : String(getNestedValue(row, col.key) ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="divider divider-start"></div>
      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        {/* Info + page size */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <p className="w-60">
            {from}–{to} of {total} items
          </p>
          <select
            className="select select-bordered select-xs"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="join">
          <button
            className="join-item btn btn-sm btn-ghost"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft size={14} />
          </button>
          <button
            className="join-item btn btn-sm btn-ghost"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft size={14} />
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <button key={`e-${i}`} className="join-item btn btn-sm" disabled>
                …
              </button>
            ) : (
              <button
                key={p}
                className={`join-item btn btn-sm ${page === p ? "btn-active" : "btn-ghost"}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            ),
          )}

          <button
            className="join-item btn btn-sm btn-ghost"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight size={14} />
          </button>
          <button
            className="join-item btn btn-sm btn-ghost"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
