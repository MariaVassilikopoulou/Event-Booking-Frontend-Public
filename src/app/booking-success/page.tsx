"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import styles from "../../styles/BookingSuccessPage.module.scss"

function BookingSuccessContent() {
    const params = useSearchParams();
    const eventName = params.get("eventName") ?? "";
    const date = params.get("date") ?? "";
    const seats = params.get("seats") ?? "";
    const total = params.get("total") ?? "";
    const bookingId = params.get("bookingId") ?? "";

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-SE", { dateStyle: "long" })
        : "";

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
                    Your seats are reserved but will only be secured after completing the payment.
                </p>
                <div className={styles.actions}>
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
