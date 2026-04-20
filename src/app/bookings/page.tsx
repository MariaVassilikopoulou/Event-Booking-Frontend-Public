"use client";

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
    if (!isLoggedIn) {
      return;
    }

    getMyBookings()
      .then(setBookings)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  async function handleCancel(booking: Booking) {
    if (!window.confirm(`Cancel your booking for "${booking.eventName}"? Seats will be restored.`)) {
      return;
    }

    setCancelling(booking.id);

    try {
      await cancelBooking(booking.eventId, booking.id);
      setBookings((previous) => previous.filter((item) => item.id !== booking.id));
      toast.success("Booking cancelled successfully.");
    } catch {
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(null);
    }
  }

  async function handlePayNow(booking: Booking) {
    setPaying(booking.id);

    try {
      const event = await getEventsById(booking.eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      const response = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          eventId: booking.eventId,
          eventName: booking.eventName,
          seats: booking.seats,
          pricePerSeat: event.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Payment setup failed");
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Payment setup failed");
      setPaying(null);
    }
  }

  const paidCount = bookings.filter((booking) => booking.status === "Paid").length;
  const pendingCount = bookings.filter((booking) => (booking.status ?? "Pending") !== "Paid").length;

  if (!isLoggedIn) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.lockedState}>
          <span className={styles.eyebrow}>Account required</span>
          <h1>Login to view your bookings.</h1>
          <p>Sign in to revisit reservations, payment status, and upcoming event details.</p>
          <Link href="/auth">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <span className={styles.eyebrow}>My bookings</span>
            <h1>Your reservations are loading.</h1>
          </section>
          {[...Array(3)].map((_, index) => (
            <div key={index} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <p role="alert" className={styles.errorState}>
            Could not load bookings. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>My bookings</span>
            <h1>Keep track of every reservation and payment.</h1>
            <p>One place to manage what you&apos;ve reserved, paid for, or still need to confirm.</p>
          </div>

          <div className={styles.heroStats}>
            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
            <div>
              <span>Paid</span>
              <strong>{paidCount}</strong>
            </div>
          </div>
        </section>

        {bookings.length === 0 ? (
          <div className={styles.empty} aria-live="polite">
            <p>You have no bookings yet.</p>
            <Link href="/events">Browse events</Link>
          </div>
        ) : (
          <div className={styles.list} aria-live="polite">
            {bookings.map((booking) => {
              const status = booking.status ?? "Pending";

              return (
                <article key={booking.id} className={styles.bookingCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.badges}>
                      <span className={styles.seatsBadge}>
                        {booking.seats} {booking.seats === 1 ? "seat" : "seats"}
                      </span>
                      <span className={status === "Paid" ? styles.paidBadge : styles.badge}>
                        {status}
                      </span>
                    </div>
                    <p className={styles.bookingId}>Booking ID: {booking.id}</p>
                  </div>

                  <h2>{booking.eventName || "Event booking"}</h2>

                  <div className={styles.meta}>
                    <p>
                      <strong>Name</strong>
                      {booking.userName}
                    </p>
                    <p>
                      <strong>Email</strong>
                      {booking.userEmail}
                    </p>
                    <p>
                      <strong>Booked on</strong>
                      {new Date(booking.bookingDate).toLocaleDateString("en-SE", { dateStyle: "medium" })}
                    </p>
                  </div>

                  {status !== "Paid" && (
                    <div className={styles.cardActions}>
                      <button
                        className={styles.payBtn}
                        onClick={() => handlePayNow(booking)}
                        disabled={paying === booking.id || cancelling === booking.id}
                      >
                        {paying === booking.id ? "Redirecting..." : "Pay now"}
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancel(booking)}
                        disabled={cancelling === booking.id || paying === booking.id}
                      >
                        {cancelling === booking.id ? "Cancelling..." : "Cancel booking"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
