"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../../styles/BookingSuccessPage.module.scss";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

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

  const formattedDate = date ? new Date(date).toLocaleDateString("en-SE", { dateStyle: "long" }) : "";

  async function handlePayNow() {
    setPaying(true);

    try {
      const response = await fetch("/api/payment/create-checkout-session", {
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
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Payment setup failed");
      }
      window.location.href = data.url;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Payment setup failed");
      setPaying(false);
    }
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.wrapper}>
        <span className={styles.pendingBadge}>Reservation created</span>
        <div className={styles.orb}></div>
        <h1>Seats reserved.</h1>
        <p className={styles.lead}>Pay now to confirm.</p>

        {eventName && (
          <div className={styles.summary}>
            <p>
              <strong>Event</strong>
              {eventName}
            </p>
            {formattedDate && (
              <p>
                <strong>Date</strong>
                {formattedDate}
              </p>
            )}
            {seats && (
              <p>
                <strong>Seats</strong>
                {seats}
              </p>
            )}
            {total && (
              <p>
                <strong>Total</strong>
                {total} SEK
              </p>
            )}
            {bookingId && <p className={styles.bookingId}>Booking ID: {bookingId}</p>}
          </div>
        )}

        <div className={styles.notice}>
          <p>Your booking is saved in My Bookings.</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.payBtn} onClick={handlePayNow} disabled={paying}>
            {paying ? "Redirecting..." : "Pay now"}
          </button>
          <Link href="/bookings" className={styles.bookingsLink}>
            My bookings
          </Link>
          <Link href="/events" className={styles.backLink}>
            Events
          </Link>
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
