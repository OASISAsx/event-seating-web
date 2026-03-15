import { PaginationParams } from "./paginationParams";
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

export interface useRegistrationStore extends PaginationParams {
  registration: Registration[];
  loading: boolean;
  total: number;
  error: string;
  fetchRegistration: () => Promise<void>;
  createRegistration: (payload: CreateRegistration) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
  // setSort: (key: string) => void;
  setSearch: (search: string) => void;
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
