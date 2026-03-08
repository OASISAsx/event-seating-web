export type SeatStatus = "available" | "occupied" | "selected";
export type SeatType = "regular" | "vip";

export interface Seat {
  id: string;
  label: string;
  row: number;
  col: number;
  status: SeatStatus;
  type: SeatType;
  price: number;
}

export interface EventInfo {
  title: string;
  organizer: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  totalSeats: number;
  availableSeats: number;
}
