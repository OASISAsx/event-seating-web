"use client";

import React from "react";

const legends = [
  {
    label: "ว่าง",
    color: "bg-base-200 border-base-300 border-2",
    textColor: "text-base-content/60",
  },
  {
    label: "เลือกแล้ว",
    color: "bg-primary border-primary border-2",
    textColor: "text-primary-content",
  },
  {
    label: "VIP",
    color: "bg-warning/20 border-warning border-2",
    textColor: "text-warning",
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
              {item.label === "VIP" ? "V" : ""}
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
