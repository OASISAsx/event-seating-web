"use client";

import { useState, useCallback, useEffect } from "react";
import type { Seat } from "../types/seat.interface";

const MAX_SEATS = 1;

export function useSeatSelection(
  seats: Seat[][],
  initialSelectedSeats: string[] = [],
) {
  const [selectedSeats, setSelectedSeats] =
    useState<string[]>(initialSelectedSeats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setSelectedSeats(initialSelectedSeats);
  }, [initialSelectedSeats]);

  const handleSeatClick = useCallback((seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }

      if (MAX_SEATS === 1) {
        return [seatId];
      }

      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, seatId];
    });
  }, []);

  const handleRemoveSeat = useCallback((seatId: string) => {
    setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
  }, []);

  const handleConfirmOpen = useCallback(() => {
    if (selectedSeats.length > 0) setIsModalOpen(true);
  }, [selectedSeats.length]);

  const handleConfirmBooking = useCallback((seatId: string) => {
    setIsModalOpen(false);
    setIsConfirmed(true);
    setSelectedSeats(seatId ? [seatId] : []);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    seats,
    selectedSeats,
    isModalOpen,
    isConfirmed,
    maxSeats: MAX_SEATS,
    handleSeatClick,
    handleRemoveSeat,
    handleConfirmOpen,
    handleConfirmBooking,
    handleCloseModal,
    setIsConfirmed,
  };
}
