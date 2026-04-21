"use client";

import React from "react";
import type { Seat } from "../types/seat.interface";

interface BookingSummaryProps {
  selectedSeats: string[];
  allSeats: Seat[][];
  maxSeats: number;
  onRemoveSeat: (seatId: string) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedSeats,
  allSeats,
  maxSeats,
  onRemoveSeat,
  onConfirm,
  isSubmitting = false,
}) => {
  const flatSeats = allSeats.flat();
  const selectedSeatDetails = selectedSeats.map((id) =>
    flatSeats.find((s) => s.id === id),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-base-content">สรุปการเลือกที่นั่ง</h3>
        <p className="text-sm text-base-content/50">
          เลือกได้สูงสุด{" "}
          <span className="text-primary font-bold">{maxSeats}</span> ที่นั่ง
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-base-content/50">ที่นั่งที่เลือก</span>
          <span className="font-bold text-primary">
            {selectedSeats.length} / {maxSeats}
          </span>
        </div>
        <progress
          className="progress progress-primary w-full h-2"
          value={selectedSeats.length}
          max={maxSeats}
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {selectedSeats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3 opacity-40">
            <svg
              className="w-10 h-10 text-base-content/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <p className="text-sm text-center">เลือกที่นั่งที่ต้องการ</p>
          </div>
        ) : (
          <div className="space-y-2 px-1">
            {selectedSeatDetails.map(
              (seat) =>
                seat && (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between rounded-xl border border-base-300/50 bg-base-200/70 p-3 group hover:border-error/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                          seat.type === "vip"
                            ? "bg-warning/20 text-warning border border-warning/50"
                            : "bg-primary/15 text-primary border border-primary/30"
                        }`}
                      >
                        {seat.type === "vip" ? "VIP" : seat.label.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-base-content">
                          ที่นั่ง {seat.label}
                        </p>
                        <p className="text-xs text-base-content/40">
                          พร้อมอัปเดตให้ผู้ลงทะเบียน
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveSeat(seat.id)}
                      className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 hover:btn-error transition-opacity"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ),
            )}
          </div>
        )}
      </div>

      <div className="divider my-3 opacity-30" />

      {selectedSeats.length > 0 && (
        <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/10 p-3">
          <p className="text-sm font-semibold text-base-content">
            ที่นั่งที่เลือกพร้อมบันทึก
          </p>
          <p className="text-xs text-base-content/50">
            ตรวจสอบหมายเลขที่นั่งก่อนยืนยันการอัปเดต
          </p>
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={selectedSeats.length === 0 || isSubmitting}
        className="btn btn-primary w-full rounded-2xl font-bold text-base h-12 shadow-lg shadow-primary/30 disabled:opacity-30 disabled:shadow-none"
      >
        {isSubmitting ? (
          "กำลังบันทึก..."
        ) : selectedSeats.length === 0 ? (
          "กรุณาเลือกที่นั่ง"
        ) : (
          <span className="flex items-center gap-2">
            บันทึกที่นั่ง
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
};
