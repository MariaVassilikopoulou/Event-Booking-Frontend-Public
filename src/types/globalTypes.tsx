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
    seats: number;
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