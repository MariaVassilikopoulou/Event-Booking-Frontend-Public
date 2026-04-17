import { CreateBookingDto, Booking } from "@/types/globalTypes";
import { useAuthStore } from "@/stores/useAuthStore";

const getAuthHeader = (): string => {
    const token = useAuthStore.getState().token;
    return token ? `Bearer ${token}` : "";
};

export const createBooking = async (booking: CreateBookingDto, token?: string): Promise<Booking> => {
    const authHeader = token ? `Bearer ${token}` : getAuthHeader();
    const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        body: JSON.stringify(booking),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Booking failed: ${res.status} ${text}`);
    }
    return res.json();
};

export const getMyBookings = async (): Promise<Booking[]> => {
    const res = await fetch("/api/bookings", {
        headers: { Authorization: getAuthHeader() },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load bookings: ${res.status} ${text}`);
    }
    return res.json();
};

export const cancelBooking = async (eventId: string, bookingId: string): Promise<void> => {
    const res = await fetch(`/api/bookings/${eventId}/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to cancel booking");
};