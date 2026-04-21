"use client";

import React from "react";
import type { Seat } from "../types/seat.interface";

interface ConfirmModalProps {
  isOpen: boolean;
  selectedSeats: string[];
  allSeats: Seat[][];
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  selectedSeats,
  allSeats,
  onConfirm,
  onClose,
  isSubmitting = false,
}) => {
  const flatSeats = allSeats.flat();
  const details = selectedSeats.map((id) => flatSeats.find((s) => s.id === id));

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box rounded-3xl max-w-sm border border-base-300/50 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 border-b border-base-300/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-base-content">
                ยืนยันการอัปเดตที่นั่ง
              </h3>
              <p className="text-xs text-base-content/50">
                กรุณาตรวจสอบข้อมูลก่อนยืนยัน
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {details.map(
            (seat) =>
              seat && (
                <div
                  key={seat.id}
                  className="flex justify-between items-center py-2 border-b border-base-300/30"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge badge-sm font-bold ${seat.type === "vip" ? "badge-warning" : "badge-primary"}`}
                    >
                      {seat.type === "vip" ? "VIP" : "ทั่วไป"}
                    </span>
                    <span className="text-sm font-semibold">
                      ที่นั่ง {seat.label}
                    </span>
                  </div>
                </div>
              ),
          )}
        </div>

        {/* Actions */}
        <div className="p-5 pt-0 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="btn btn-ghost flex-1 rounded-2xl border border-base-300"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="btn btn-primary flex-1 rounded-2xl font-bold shadow-lg shadow-primary/30"
          >
            {isSubmitting ? "กำลังบันทึก..." : "ยืนยันที่นั่ง"}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop bg-base-content/20 backdrop-blur-sm"
        onClick={onClose}
      />
    </dialog>
  );
};
