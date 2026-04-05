import { PaginationParams } from "./paginationParams";
import { Events } from "./event.interface";
import { Seat } from "./seat.interface";

export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: string;
  eventId: string;
  event: Events;
  seatId: string;
  seat: Seat[];
}

export interface useRegistrationStore extends PaginationParams {
  registration: Registration[];
  registrationByEvent: Registration[] | null;
  registrationByEventId: Registration | null;
  loading: boolean;
  total: number;
  error: string;
  requestId: number | null;
  currentEventId: string | number | null;
  mainStatus: { [key: string]: { status: number } };
  fetchRegistration: () => Promise<void>;
  addRegistration: (item: Registration) => void;
  fetchRegistrationByEvent: (eventId: string) => Promise<void>;
  createRegistration: (payload: CreateRegistration) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
  // setSort: (key: string) => void;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  // reset: () => void;
  _getParams: () => URLSearchParams;
}

export interface CreateRegistration {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventId?: string;
}
