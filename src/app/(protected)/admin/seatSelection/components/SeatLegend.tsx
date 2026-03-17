"use client";

import { Check } from "lucide-react";
import React from "react";

const legends = [
  {
    label: "ว่าง",
    color: "bg-primary border-base-300 border-2",
    textColor: "text-base-content/60",
  },
  {
    label: "เลือกแล้ว",
    color:
      "bg-base-300 border-primary border-2 flex items-center justify-center",
    textColor: "text-primary-content",
  },

  {
    label: "ไม่ว่าง",
    color: "bg-base-300/40 border-base-300/30 border-2",
    textColor: "text-base-content/20",
  },
];

export const SeatLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 px-4 py-3 rounded-2xl bg-base-200/50 backdrop-blur-sm border border-base-300/50">
      {legends.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-t-md flex items-center justify-center ${item.color}`}
          >
            <span className={`text-[8px] font-bold ${item.textColor}`}>
              {item.label === "ไม่ว่าง" ? (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              ) : item.label === "เลือกแล้ว" ? (
                <Check size={14} />
              ) : null}
            </span>
          </div>
          <span className="text-xs text-base-content/60 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
