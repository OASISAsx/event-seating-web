"use client";

import React from "react";
import type { Seat } from "../types/seat.interface";

interface BookingSummaryProps {
  selectedSeats: string[];
  allSeats: Seat[][];
  maxSeats: number;
  onRemoveSeat: (seatId: string) => void;
  onConfirm: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedSeats,
  allSeats,
  maxSeats,
  onRemoveSeat,
  onConfirm,
}) => {
  const flatSeats = allSeats.flat();
  const selectedSeatDetails = selectedSeats.map((id) =>
    flatSeats.find((s) => s.id === id),
  );

  const totalPrice = selectedSeatDetails.reduce((sum, seat) => {
    return sum + (seat?.price ?? 0);
  }, 0);

  const vipCount = selectedSeatDetails.filter((s) => s?.type === "vip").length;
  const regularCount = selectedSeatDetails.filter(
    (s) => s?.type === "regular",
  ).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-base-content">สรุปการจอง</h3>
        <p className="text-sm text-base-content/50">
          เลือกได้สูงสุด{" "}
          <span className="text-primary font-bold">{maxSeats}</span> ที่นั่ง
        </p>
      </div>

      {/* Seat Count Progress */}
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

      {/* Selected Seats List */}
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
          <div className="space-y-2">
            {selectedSeatDetails.map(
              (seat) =>
                seat && (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-base-200/70 border border-base-300/50 group hover:border-error/30 transition-colors"
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
                          {seat.type === "vip" ? "VIP Zone" : "ทั่วไป"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">
                        ฿{seat.price.toLocaleString()}
                      </span>
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
                  </div>
                ),
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="divider my-3 opacity-30" />

      {/* Price Breakdown */}
      {selectedSeats.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {regularCount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-base-content/50">
                ที่นั่งทั่วไป × {regularCount}
              </span>
              <span className="font-medium">
                ฿
                {selectedSeatDetails
                  .filter((s) => s?.type === "regular")
                  .reduce((sum, s) => sum + (s?.price ?? 0), 0)
                  .toLocaleString()}
              </span>
            </div>
          )}
          {vipCount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-base-content/50">VIP × {vipCount}</span>
              <span className="font-medium text-warning">
                ฿
                {selectedSeatDetails
                  .filter((s) => s?.type === "vip")
                  .reduce((sum, s) => sum + (s?.price ?? 0), 0)
                  .toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
        <span className="font-bold text-base-content">ยอดรวม</span>
        <span className="text-xl font-black text-primary">
          ฿{totalPrice.toLocaleString()}
        </span>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={selectedSeats.length === 0}
        className="btn btn-primary w-full rounded-2xl font-bold text-base h-12 shadow-lg shadow-primary/30 disabled:opacity-30 disabled:shadow-none"
      >
        {selectedSeats.length === 0 ? (
          "กรุณาเลือกที่นั่ง"
        ) : (
          <span className="flex items-center gap-2">
            ยืนยันการจอง
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
