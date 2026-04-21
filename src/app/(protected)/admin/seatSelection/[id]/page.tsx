"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Grip, SquareCheckBig, Target } from "lucide-react";
import { useEvent } from "@/store/event.store";
import { useRegistration } from "@/store/registration.store";
import { BookingSummary } from "../components/BookingSummary";
import { ConfirmModal } from "../components/ConfirmModal";
import { EventInfo } from "../components/EventInfo";
import { SeatLegend } from "../components/SeatLegend";
import { SeatMap } from "../components/SeatMap";
import { useSeatSelection } from "../hooks/useSeatSelection";
import { mapApiSeatsToSeatGrid } from "../lib/mapApiSeats";
import type { EventInfo as EventInfoType } from "../types/seat.interface";

export default function SeatSelectionPage() {
  const params = useParams();
  const registrationId = Array.isArray(params.id) ? params.id[0] : params.id;
  const {
    fetchRegistrationByEvent,
    registrationByEventId,
    updateRegistrationSeat,
  } = useRegistration();
  const { getEventById, event } = useEvent();
  const seatGrid = useMemo(
    () => mapApiSeatsToSeatGrid(event?.seats, registrationByEventId?.seatId),
    [event?.seats, registrationByEventId?.seatId],
  );
  const initialSelectedSeats = useMemo(
    () => (registrationByEventId?.seatId ? [registrationByEventId.seatId] : []),
    [registrationByEventId?.seatId],
  );
  const {
    seats,
    selectedSeats,
    isModalOpen,
    isConfirmed,
    maxSeats,
    handleSeatClick,
    handleRemoveSeat,
    handleConfirmOpen,
    handleConfirmBooking,
    handleCloseModal,
    setIsConfirmed,
  } = useSeatSelection(seatGrid, initialSelectedSeats);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const availableSeatsCount = useMemo(
    () =>
      seats
        .flat()
        .filter(
          (seat) =>
            seat.status === "available" && !selectedSeats.includes(seat.id),
        ).length,
    [seats, selectedSeats],
  );

  useEffect(() => {
    if (registrationId) {
      fetchRegistrationByEvent(registrationId);
    }
  }, [fetchRegistrationByEvent, registrationId]);

  useEffect(() => {
    if (!registrationByEventId) return;

    getEventById(registrationByEventId.eventId);
  }, [registrationByEventId, getEventById]);

  const onConfirmSeatUpdate = async () => {
    const selectedSeatId = selectedSeats[0];

    if (!registrationId || !selectedSeatId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateRegistrationSeat(registrationId, { seatId: selectedSeatId });
      await fetchRegistrationByEvent(registrationId);
      handleConfirmBooking(selectedSeatId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventInfo: EventInfoType = {
    title: event?.name || "-",
    organizer: "Digital Economy Promotion Agency",
    date: event?.endDate
      ? new Date(event.endDate).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
    time: event?.endDate
      ? new Date(event.endDate).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "" + " น." || "",
    venue: event?.location || "-",
    category: "Technology",
    totalSeats: seats.flat().length || event?.totalSeats || 0,
    availableSeats: availableSeatsCount,
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isConfirmed && (
          <div className="alert alert-success mb-4 rounded-2xl shadow-lg shadow-success/20 animate-in slide-in-from-top">
            <svg
              className="w-5 h-5"
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
            <span className="font-semibold">
              อัปเดตที่นั่งสำหรับผู้ลงทะเบียนสำเร็จ
            </span>
            <button
              onClick={() => setIsConfirmed(false)}
              className="btn btn-ghost btn-xs btn-circle ml-auto"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-6">
          <EventInfo event={eventInfo} />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "ที่นั่งทั้งหมด",
              value: eventInfo.totalSeats,
              icon: <Grip />,
              color: "text-primary",
            },
            {
              label: "ว่างอยู่",
              value: eventInfo.availableSeats,
              icon: <SquareCheckBig />,
              color: "text-primary",
            },
            {
              label: "ที่เลือก",
              value: selectedSeats.length,
              icon: <Target />,
              color: "text-primary",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card bg-base-300 border-base-300/40 rounded-2xl p-3 text-center"
            >
              <div className="flex items-center justify-center">{stat.icon}</div>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-base-conten font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="card bg-base-300 border border-base-300/40 rounded-3xl p-5 overflow-x-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-2">
              <div className="space-y-1">
                <h2 className="flex text-base font-black text-base-content">
                  แผนผังที่นั่ง
                </h2>
                <p className="text-xs text-base-content/40">
                  เลือกที่นั่งใหม่เพื่ออัปเดตให้ผู้ลงทะเบียน
                </p>
              </div>

              <SeatLegend />
            </div>

            {seats.length > 0 ? (
              <SeatMap
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
              />
            ) : (
              <div className="flex min-h-64 items-center justify-center text-sm text-base-content/50">
                ไม่พบข้อมูลที่นั่งสำหรับอีเวนต์นี้
              </div>
            )}
          </div>

          <div className="card bg-base-300 border border-base-300/40 rounded-3xl p-5 lg:h-fit lg:sticky lg:top-20">
            <BookingSummary
              selectedSeats={selectedSeats}
              allSeats={seats}
              maxSeats={maxSeats}
              onRemoveSeat={handleRemoveSeat}
              onConfirm={handleConfirmOpen}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        selectedSeats={selectedSeats}
        allSeats={seats}
        onConfirm={onConfirmSeatUpdate}
        onClose={handleCloseModal}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
