"use client";

import React, { useEffect } from "react";

import type { EventInfo as EventInfoType } from "../types/seat.interface";
import { generateSeats } from "../lib/generateSeats";
import { useSeatSelection } from "../hooks/useSeatSelection";
import { EventInfo } from "../components/EventInfo";
import { SeatLegend } from "../components/SeatLegend";
import { SeatMap } from "../components/SeatMap";
import { BookingSummary } from "../components/BookingSummary";
import { ConfirmModal } from "../components/ConfirmModal";
import { useRouter } from "next/dist/client/components/navigation";
import { useParams } from "next/navigation";
import { MoveLeft, MoveRight } from "lucide-react";
import { useEvent } from "@/store/event.store";
import { useRegistration } from "@/store/registration.store";

const initialSeats = generateSeats();

export default function SeatSelectionPage() {
  const {
    seats,
    selectedSeats,
    isModalOpen,
    isConfirmed,
    maxSeats,
    totalPrice,
    handleSeatClick,
    handleRemoveSeat,
    handleConfirmOpen,
    handleConfirmBooking,
    handleCloseModal,
    setIsConfirmed,
  } = useSeatSelection(initialSeats);
  const { getEventById, event } = useEvent();
  const route = useRouter();
  const { fetchRegistrationByEvent, registrationByEvent } = useRegistration();
  const params = useParams();

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    console.log("Event ID from params:", id);
    if (id) {
      fetchRegistrationByEvent(id);
    }
  }, [params.id, fetchRegistrationByEvent]);

  useEffect(() => {
    if (!registrationByEvent) return;

    getEventById(registrationByEvent.eventId);
  }, [registrationByEvent, getEventById]);

  const EVENT: EventInfoType = {
    title: event?.name || "-",
    organizer: "Digital Economy Promotion Agency",
    date: event?.endDate
      ? new Date(event.endDate).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
    time: "09:00 – 17:00 น.",
    venue: "อาคาร IMPACT Arena ห้อง 1",
    category: "Technology",
    totalSeats: event?.totalSeats || 0,
    availableSeats: event?.seatsPerRow || 0,
  };
  return (
    <div className="min-h-screen bg-base-100">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-xl border-b border-base-300/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 ">
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => route.push("/admin")}
            >
              <MoveLeft />
            </button>
            <div>
              <p className="text-xs text-gray-500 font-medium">กลับไปยัง</p>
              <p className="text-sm font-bold text-gray-500 leading-tight">
                รายละเอียดงาน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="badge badge-primary badge-outline font-semibold">
              ขั้นตอน 2/3
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Success Toast */}
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
              จองที่นั่งสำเร็จ! กำลังนำไปสู่หน้าชำระเงิน...
            </span>
            <button
              onClick={() => setIsConfirmed(false)}
              className="btn btn-ghost btn-xs btn-circle ml-auto"
            >
              ✕
            </button>
          </div>
        )}

        {/* Event Info */}
        <div className="mb-6">
          <EventInfo event={EVENT} />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "ที่นั่งทั้งหมด",
              value: EVENT.totalSeats,
              icon: "🪑",
              color: "text--base-100",
            },
            {
              label: "ว่างอยู่",
              value: EVENT.availableSeats - selectedSeats.length,
              icon: "✅",
              color: "text-success",
            },
            {
              label: "ที่เลือก",
              value: selectedSeats.length,
              icon: "🎯",
              color: "text-primary",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card bg-neutral-content  border-base-300/40 rounded-2xl p-3 text-center"
            >
              <span className="text-lg">{stat.icon}</span>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-neutral font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* LEFT: Seat Map */}
          <div className="card bg-base-200/40 border border-base-300/40 rounded-3xl p-5 overflow-x-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-black text-base-content">
                  แผนผังที่นั่ง
                </h2>
                <p className="text-xs text-base-content/40">
                  แถว A–B = VIP | แถว C–H = ทั่วไป
                </p>
              </div>
              <SeatLegend />
            </div>
            <SeatMap
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
          </div>

          {/* RIGHT: Summary */}
          <div className="card bg-base-200/40 border border-base-300/40 rounded-3xl p-5 lg:h-fit lg:sticky lg:top-20">
            <BookingSummary
              selectedSeats={selectedSeats}
              allSeats={seats}
              maxSeats={maxSeats}
              onRemoveSeat={handleRemoveSeat}
              onConfirm={handleConfirmOpen}
            />
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        selectedSeats={selectedSeats}
        allSeats={seats}
        totalPrice={totalPrice}
        onConfirm={handleConfirmBooking}
        onClose={handleCloseModal}
      />

      {/* Mobile Sticky Footer */}
      {selectedSeats.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100/90 backdrop-blur-xl border-t border-base-300/50 p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-base-content/50">
              {selectedSeats.length} ที่นั่ง
            </p>
            <p className="text-lg font-black text-primary">
              ฿{totalPrice.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleConfirmOpen}
            className="btn btn-primary rounded-2xl px-6 font-bold shadow-lg shadow-primary/30"
          >
            ยืนยันการจอง
          </button>
        </div>
      )}
    </div>
  );
}
