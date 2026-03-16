"use client";

import React from "react";
import type { EventInfo as EventInfoType } from "../types/seat.interface";

interface EventInfoProps {
  event: EventInfoType;
}

export const EventInfo: React.FC<EventInfoProps> = ({ event }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-base-300 via-base-300 to-primary border border-base-300/50 p-5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Event Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10">
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>

        {/* Event Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <h2 className="text-lg font-black text-base-content leading-tight">
              {event.title}
            </h2>
            <span className="badge badge-primary badge-sm font-semibold">
              {event.category}
            </span>
          </div>
          <p className="text-sm text-base-content/50 mt-0.5 truncate">
            {event.organizer}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-row sm:flex-col gap-3 sm:gap-1.5 sm:text-right flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-base-content/60">
            <svg
              className="w-3.5 h-3.5 text-primary/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-base-content/60">
            <svg
              className="w-3.5 h-3.5 text-primary/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-base-content/60">
            <svg
              className="w-3.5 h-3.5 text-primary/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-medium">{event.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
