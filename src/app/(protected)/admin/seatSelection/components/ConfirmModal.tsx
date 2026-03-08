"use client";

import React from "react";
import type { Seat } from "../types/seat.interface";

interface ConfirmModalProps {
  isOpen: boolean;
  selectedSeats: string[];
  allSeats: Seat[][];
  totalPrice: number;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  selectedSeats,
  allSeats,
  totalPrice,
  onConfirm,
  onClose,
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
                ยืนยันการจองที่นั่ง
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
                  <span className="text-sm font-bold text-primary">
                    ฿{seat.price.toLocaleString()}
                  </span>
                </div>
              ),
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="font-black text-base-content">ยอดรวมทั้งสิ้น</span>
            <span className="text-2xl font-black text-primary">
              ฿{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="btn btn-ghost flex-1 rounded-2xl border border-base-300"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-primary flex-1 rounded-2xl font-bold shadow-lg shadow-primary/30"
          >
            ชำระเงิน
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
