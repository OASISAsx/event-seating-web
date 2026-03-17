"use client";

import React from "react";
import { SeatItem } from "./SeatItems";
import type { Seat } from "../types/seat.interface";

interface SeatMapProps {
  seats: Seat[][];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeats,
  onSeatClick,
}) => {
  console.log("Rendering SeatMap with seats:", seats);
  console.log("Selected seats:", selectedSeats);
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Stage / Screen */}
      <div className="relative w-full max-w-xl mb-6">
        <div className="stage-bar h-3 rounded-full w-full opacity-80" />
        <p className="text-center text-xs font-semibold tracking-[0.3em] uppercase mt-2 text-base-content/40">
          เวที / Stage
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full items-center">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-1">
            <span className="w-6 text-right text-xs font-bold text-base-content/30 mr-1 font-mono">
              {String.fromCharCode(65 + rowIndex)}
            </span>

            <div className="flex gap-1.5">
              {row.map((seat) => (
                <SeatItem
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.id)}
                  onClick={() =>
                    seat.status === "available" && onSeatClick(seat.id)
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Column Numbers */}
      <div className="flex items-center gap-1 mt-1 ml-8">
        {seats[0]?.map((_, colIndex) => (
          <span
            key={colIndex}
            className="w-7 text-center text-[10px] text-base-content/25 font-mono"
          >
            {colIndex + 1}
          </span>
        ))}
      </div>
    </div>
  );
};
