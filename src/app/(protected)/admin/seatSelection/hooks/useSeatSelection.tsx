"use client";

import { useState, useCallback } from "react";
import type { Seat } from "../types/seat.interface";

const MAX_SEATS = 5;

export function useSeatSelection(initialSeats: Seat[][]) {
  const [seats] = useState<Seat[][]>(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSeatClick = useCallback((seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
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

  const handleConfirmBooking = useCallback(() => {
    setIsModalOpen(false);
    setIsConfirmed(true);
    setSelectedSeats([]);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const totalPrice = selectedSeats.reduce((sum, id) => {
    const seat = seats.flat().find((s) => s.id === id);
    return sum + (seat?.price ?? 0);
  }, 0);

  return {
    seats,
    selectedSeats,
    isModalOpen,
    isConfirmed,
    maxSeats: MAX_SEATS,
    totalPrice,
    handleSeatClick,
    handleRemoveSeat,
    handleConfirmOpen,
    handleConfirmBooking,
    handleCloseModal,
    setIsConfirmed,
  };
}
