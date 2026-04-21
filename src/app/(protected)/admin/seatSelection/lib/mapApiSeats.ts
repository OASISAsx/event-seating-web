import type { Seat as ApiSeat } from "@/types/seat.interface";
import type { Seat as SeatSelectionSeat } from "../types/seat.interface";

const SEAT_NUMBER_PATTERN = /^([A-Za-z]+)[-\s]?(\d+)$/;

type ParsedSeat = {
  rowLabel: string;
  rowIndex: number;
  seat: SeatSelectionSeat;
};

function getSeatId(seat: ApiSeat): string {
  return seat.id || seat._id || "";
}

function getRowIndex(rowLabel: string): number {
  return rowLabel
    .toUpperCase()
    .split("")
    .reduce((sum, char) => sum * 26 + (char.charCodeAt(0) - 64), 0);
}

function parseSeat(
  seat: ApiSeat,
  currentSeatId?: string | null,
): ParsedSeat | null {
  const seatId = getSeatId(seat);
  const matchedSeatNumber = seat.seatNumber.match(SEAT_NUMBER_PATTERN);

  if (!seatId || !matchedSeatNumber) {
    return null;
  }

  const [, rowLabel, columnLabel] = matchedSeatNumber;
  const columnIndex = Number(columnLabel);

  return {
    rowLabel,
    rowIndex: getRowIndex(rowLabel),
    seat: {
      id: seatId,
      label: seat.seatNumber,
      row: getRowIndex(rowLabel) - 1,
      col: columnIndex - 1,
      status:
        seat.isBooked && seatId !== currentSeatId ? "occupied" : "available",
      type: "regular",
      price: 0,
    },
  };
}

export function mapApiSeatsToSeatGrid(
  seats: ApiSeat[] | undefined,
  currentSeatId?: string | null,
): SeatSelectionSeat[][] {
  if (!seats?.length) {
    return [];
  }

  const groupedSeats = seats.reduce<Map<string, ParsedSeat[]>>((rows, seat) => {
    const parsedSeat = parseSeat(seat, currentSeatId);

    if (!parsedSeat) {
      return rows;
    }

    const existingRow = rows.get(parsedSeat.rowLabel) ?? [];
    existingRow.push(parsedSeat);
    rows.set(parsedSeat.rowLabel, existingRow);

    return rows;
  }, new Map());

  return [...groupedSeats.entries()]
    .sort(
      ([, leftSeats], [, rightSeats]) =>
        leftSeats[0].rowIndex - rightSeats[0].rowIndex,
    )
    .map(([, rowSeats]) =>
      rowSeats
        .sort((leftSeat, rightSeat) => leftSeat.seat.col - rightSeat.seat.col)
        .map(({ seat }) => seat),
    );
}
