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