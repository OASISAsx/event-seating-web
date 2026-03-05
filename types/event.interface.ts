import { Registration } from "./registration.interface";
import { Seat } from "./seat.interface";

export interface Events {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  seatsPerRow: number;
  totalSeats: number;
  isActive: boolean;
  status: string;
  registrations: Registration[];
  seat: Seat[];
}

export interface UseEventsStore {
  loading: boolean;
  events: Events[];
  fetchEvent: () => Promise<void>;
}
