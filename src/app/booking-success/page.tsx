"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import styles from "../../styles/BookingSuccessPage.module.scss"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"

function BookingSuccessContent() {
    const params = useSearchParams();
    const eventName = params.get("eventName") ?? "";
    const date = params.get("date") ?? "";
    const seats = params.get("seats") ?? "";
    const total = params.get("total") ?? "";
    const bookingId = params.get("bookingId") ?? "";
    const eventId = params.get("eventId") ?? "";
    const pricePerSeat = params.get("pricePerSeat") ?? "0";

    const { token } = useAuthStore();
    const [paying, setPaying] = useState(false);

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-SE", { dateStyle: "long" })
        : "";

    const handlePayNow = async () => {
        setPaying(true);
        try {
            const res = await fetch("/api/payment/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    bookingId,
                    eventId,
                    eventName,
                    seats: Number(seats),
                    pricePerSeat: Number(pricePerSeat),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? "Payment setup failed");
            window.location.href = data.url;
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Payment setup failed");
            setPaying(false);
        }
    };

    return (
        <div className={styles.pageBackground}>
            <div className={styles.wrapper}>
                <h1>Booking Confirmed!</h1>
                <h2>Thank you for booking with Flowvent.</h2>

                {eventName && (
                    <div className={styles.summary}>
                        <p><strong>Event:</strong> {eventName}</p>
                        {formattedDate && <p><strong>Date:</strong> {formattedDate}</p>}
                        {seats && <p><strong>Seats:</strong> {seats}</p>}
                        {total && <p><strong>Total:</strong> {total} SEK</p>}
                        {bookingId && <p className={styles.bookingId}>Booking ID: {bookingId}</p>}
                    </div>
                )}

                <p>A confirmation email has been sent to your inbox.</p>
                <p className={styles.warning}>
                    Your seats are reserved — complete payment below to secure them.
                </p>
                <div className={styles.actions}>
                    <button className={styles.payBtn} onClick={handlePayNow} disabled={paying}>
                        {paying ? "Redirecting…" : "Pay Now"}
                    </button>
                    <Link href="/bookings" className={styles.bookingsLink}>View My Bookings</Link>
                    <Link href="/" className={styles.backLink}>Back to Events</Link>
                </div>
            </div>
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>}>
            <BookingSuccessContent />
        </Suspense>
    );
}
