"use client";
import React from "react";

export default function Skeleton() {
  return (
    <div>
      <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-32 w-full bg-base-content"></div>
        <div className="skeleton h-4 w-28 bg-base-content"></div>
        <div className="skeleton h-4 w-full bg-base-content"></div>
        <div className="skeleton h-4 w-full bg-base-content"></div>
      </div>
    </div>
  );
}
