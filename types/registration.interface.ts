import { Events } from "./event.interface";
import { Seat } from "./seat.interface";

export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  eventId: string;
  event: Events;
  seatId: string;
  seat: Seat[];
}

export interface useRegistrationStore {
  registration: Registration[];
  loading: boolean;
  fetchRegistration: () => Promise<void>;
}
