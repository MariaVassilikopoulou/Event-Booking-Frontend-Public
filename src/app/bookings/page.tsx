"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getMyBookings, cancelBooking } from "@/services/bookingService";
import { getEventsById } from "@/services/eventService";
import { Booking } from "@/types/globalTypes";
import styles from "../../styles/BookingsPage.module.scss";
import { toast } from "sonner";

export default function BookingsPage() {
    const { isLoggedIn, token } = useAuthStore();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [paying, setPaying] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) return;
        getMyBookings()
            .then(setBookings)
            .catch(err => setError((err as Error).message))
            .finally(() => setLoading(false));
    }, [isLoggedIn]);

    const handleCancel = async (b: Booking) => {
        if (!window.confirm(`Cancel your booking for "${b.eventName}"? Seats will be restored.`)) return;
        setCancelling(b.id);
        try {
            await cancelBooking(b.eventId, b.id);
            setBookings(prev => prev.filter(x => x.id !== b.id));
            toast.success("Booking cancelled successfully.");
        } catch {
            toast.error("Failed to cancel booking. Please try again.");
        } finally {
            setCancelling(null);
        }
    };

    const handlePayNow = async (b: Booking) => {
        setPaying(b.id);
        try {
            const event = await getEventsById(b.eventId);
            if (!event) throw new Error("Event not found");
            const res = await fetch("/api/payment/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    bookingId: b.id,
                    eventId: b.eventId,
                    eventName: b.eventName,
                    seats: b.seats,
                    pricePerSeat: event.price,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? "Payment setup failed");
            window.location.href = data.url;
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Payment setup failed");
            setPaying(null);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    <div className={styles.empty}>
                        <p>You must be logged in to view your bookings.</p>
                        <Link href="/auth">Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h1>My Bookings</h1>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={styles.skeleton} />
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h1>My Bookings</h1>
                <p role="alert" style={{ color: "#dc2626" }}>
                    Could not load bookings. Please refresh the page.
                </p>
            </div>
        </div>
    );

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h1>My Bookings</h1>
                <p>All your upcoming and past bookings</p>

                {bookings.length === 0 ? (
                    <div className={styles.empty} aria-live="polite">
                        <p>You have no bookings yet.</p>
                        <Link href="/events">Browse Events</Link>
                    </div>
                ) : (
                    <div aria-live="polite">
                        {bookings.map(b => {
                            const status = b.status ?? "Pending";
                            return (
                                <div key={b.id} className={styles.bookingCard}>
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                                        <span className={styles.seatsBadge}>
                                            {b.seats} {b.seats === 1 ? "seat" : "seats"}
                                        </span>
                                        <span className={status === "Paid" ? styles.paidBadge : styles.badge}>
                                            {status}
                                        </span>
                                    </div>
                                    <h2>{b.eventName || "Event booking"}</h2>
                                    <p><strong>Name:</strong> {b.userName}</p>
                                    <p><strong>Email:</strong> {b.userEmail}</p>
                                    <p><strong>Booked on:</strong> {new Date(b.bookingDate).toLocaleDateString("en-SE", { dateStyle: "medium" })}</p>
                                    <p className={styles.bookingId}>Booking ID: {b.id}</p>
                                    {status !== "Paid" && (
                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.payBtn}
                                                onClick={() => handlePayNow(b)}
                                                disabled={paying === b.id || cancelling === b.id}
                                            >
                                                {paying === b.id ? "Redirecting…" : "Pay Now"}
                                            </button>
                                            <button
                                                className={styles.cancelBtn}
                                                onClick={() => handleCancel(b)}
                                                disabled={cancelling === b.id || paying === b.id}
                                            >
                                                {cancelling === b.id ? "Cancelling…" : "Cancel Booking"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
