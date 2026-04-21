import { Events } from "./event.interface";
import { Registration } from "./registration.interface";

export interface Seat {
  id?: string;
  _id?: string;
  seatNumber: string;
  isBooked: boolean;
  seatAssignedAt: string;
  event: Events[];
  eventId: string;
  registrations: Registration;
}
