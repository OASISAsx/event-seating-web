"use client";

import React from "react";
import type { Seat } from "../types/seat.interface";

interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  onClick: () => void;
}

const seatStyles = {
  available:
    "bg-primary border-base-300 hover:bg-primary/20 hover:border-primary hover:scale-110 cursor-pointer text-base-content/50 hover:text-primary transition-all duration-200",
  selected:
    "bg-base-300 border-primary shadow-lg shadow-primary/40 scale-110 cursor-pointer text-primary-content seat-pulse",
  occupied:
    "bg-base-300/40 border-base-300/30 cursor-not-allowed text-base-content/20 ",
  // vip: "bg-warning/20 border-warning hover:bg-warning/40 hover:scale-110 cursor-pointer text-warning hover:shadow-warning/30 hover:shadow-md transition-all duration-200",
  // vipSelected:
  //   "bg-warning border-warning shadow-lg shadow-warning/40 scale-110 cursor-pointer text-warning-content seat-pulse",
};

export const SeatItem: React.FC<SeatItemProps> = ({
  seat,
  isSelected,
  onClick,
}) => {
  const getStyle = () => {
    if (seat.status === "occupied") return seatStyles.occupied;
    // if (seat.type === "vip") {
    //   return isSelected ? seatStyles.vipSelected : seatStyles.vip;
    // }
    return isSelected ? seatStyles.selected : seatStyles.available;
  };

  return (
    <button
      onClick={onClick}
      disabled={seat.status === "occupied"}
      className={`
        relative w-7 h-7 rounded-t-lg border-2 text-[9px] font-bold
        flex items-center justify-center
        ${getStyle()}
      `}
      title={`ที่นั่ง ${seat.label}${seat.type === "vip" ? " (VIP)" : ""}`}
    >
      {/* Seat Back */}
      <span className="absolute -top-0.5 left-0 right-0 h-1 bg-current opacity-30 rounded-t-sm" />

      {seat.status === "occupied" ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : isSelected ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : seat.status === "available" ? (
        seat.label
      ) : null}
    </button>
  );
};
