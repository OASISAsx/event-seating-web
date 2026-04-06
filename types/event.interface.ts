import { Registration } from "./registration.interface";
import { Seat } from "./seat.interface";

export interface Events {
  id: string;
  name: string;
  description: string;
  imageEvent: string;
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
  event: Events | null;
  fetchEvent: () => Promise<void>;
  getEventById: (id: string) => Promise<void>;
  createEvent: (payload: CreateEvent) => Promise<void>;
}

export interface CreateEvent {
  id?: string;
  name: string;
  description: string;
  imageEvent: string;
  location: string;
  startDate: string;
  endDate: string;
  seatsPerRow: number;
  totalSeats: number;
}
