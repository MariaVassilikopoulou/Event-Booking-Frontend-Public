import { CreateBookingDto, Booking } from "@/types/globalTypes";
import { useAuthStore } from "@/stores/useAuthStore";

const getAuthHeader = (): string => {
    const token = useAuthStore.getState().token;
    return token ? `Bearer ${token}` : "";
};

export const createBooking = async (booking: CreateBookingDto): Promise<Booking> => {
    const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
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