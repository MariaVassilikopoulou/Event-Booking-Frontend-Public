export  interface Event{
    id: string;
    name: string;
    date: string;
    location: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
}

export interface CreateBookingDto{
    userName: string;
    userEmail: string;
    eventId: string;
    eventName: string;
    seats: number;
}

export interface Booking {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    eventId: string;
    eventName: string;
    seats: number;
    bookingDate: string;
}

export interface AuthState {
    isLoggedIn: boolean;
    userName: string | null;
    userEmail: string | null;
    token: string | null;
    login: (token: string, userName: string, email: string) => void;
    logout: () => void;
    loadFromStorage: () => void;
}

export type NormalizedEvent = {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  seatsAvailable: number;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  recommendedEvents?: NormalizedEvent[];
};

export type BackendEvent = {
  Name?: string;
  Location?: string;
  Date?: string;
  Price?: number;
  SeatsAvailable?: number;
  name?: string;
  date?: string;
  location?: string;
  price?: number;
  seatsAvailable?: number;
};