import { Events } from "./event.interface";
import { Seat } from "./seat.interface";

export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventId: string;
  event: Events;
  seatId: string;
  seat: Seat[];
}

export interface useRegistrationStore {
  registration: Registration[];
  loading: boolean;
  error: {
    message: string;
  } | null;
  fetchRegistration: () => Promise<void>;
  createRegistration: (payload: CreateRegistration) => Promise<void>;
}

export interface CreateRegistration {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventId?: string;
}
