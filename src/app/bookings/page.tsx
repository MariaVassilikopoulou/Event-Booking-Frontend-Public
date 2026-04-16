"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getMyBookings } from "@/services/bookingService";
import { Booking } from "@/types/globalTypes";
import styles from "../../styles/BookingsPage.module.scss";

export default function BookingsPage() {
    const { isLoggedIn } = useAuthStore();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) return;
        getMyBookings()
            .then(setBookings)
            .catch(err => setError((err as Error).message))
            .finally(() => setLoading(false));
    }, [isLoggedIn]);

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
                        {bookings.map(b => (
                            <div key={b.id} className={styles.bookingCard}>
                                <span className={styles.badge}>{b.seats} {b.seats === 1 ? "seat" : "seats"}</span>
                                <h2>{b.eventName || "Event booking"}</h2>
                                <p><strong>Name:</strong> {b.userName}</p>
                                <p><strong>Email:</strong> {b.userEmail}</p>
                                <p><strong>Booked on:</strong> {new Date(b.bookingDate).toLocaleDateString("en-SE", { dateStyle: "medium" })}</p>
                                <p className={styles.bookingId}>Booking ID: {b.id}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
