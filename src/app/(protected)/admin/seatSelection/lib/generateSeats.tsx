import type { Seat } from "../types/seat.interface";

const ROWS = 10;
const COLS = 10;
// const VIP_ROWS = [0, 1];
// const OCCUPIED_PROBABILITY = 0.3;

// const VIP_PRICE = 2500;
const REGULAR_PRICE = 1200;

// Pre-defined occupied seats for consistency
const OCCUPIED_SEATS = new Set([
  "A-2",
  "A-5",
  "A-8",
  "B-1",
  "B-4",
  "B-7",
  "B-9",
  "C-3",
  "C-6",
  "C-10",
  "D-2",
  "D-5",
  "D-8",
  "E-1",
  "E-4",
  "E-7",
  "F-3",
  "F-6",
  "F-9",
  "G-2",
  "G-5",
  "G-8",
  "G-10",
  "H-1",
  "H-4",
  "H-7",
]);

export function generateSeats(): Seat[][] {
  const seats: Seat[][] = [];

  for (let row = 0; row < ROWS; row++) {
    const rowSeats: Seat[] = [];
    const rowLetter = String.fromCharCode(65 + row);

    for (let col = 0; col < COLS; col++) {
      const colNum = col + 1;
      const label = `${rowLetter}${colNum}`;
      // const isVip = VIP_ROWS.includes(row);
      const isOccupied = OCCUPIED_SEATS.has(label);

      rowSeats.push({
        id: label,
        label,
        row,
        col,
        status: isOccupied ? "occupied" : "available",
        type: "regular",
        price: REGULAR_PRICE,
      });
    }

    seats.push(rowSeats);
  }

  return seats;
}
