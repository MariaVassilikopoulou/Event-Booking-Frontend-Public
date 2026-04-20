import { Event } from "@/types/globalTypes";
import { useEffect, useState } from "react";
import styles from "../styles/BookingForm.module.scss";
import { createBooking } from "@/services/bookingService";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface Props {
  event: Event;
  onBookingSuccess?: () => void;
}

export default function BookingForm({ event, onBookingSuccess }: Props) {
  const { userName: storedName, userEmail: storedEmail, isLoggedIn, token } = useAuthStore();
  const [name, setName] = useState(storedName ?? "");
  const [email, setEmail] = useState(storedEmail ?? "");
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (storedName) {
      setName(storedName);
    }

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [storedEmail, storedName]);

  const total = (event.price * seats).toFixed(2);
  const maxSeats = Math.max(event.availableSeats, 1);
  const soldOut = event.availableSeats === 0;

  function updateSeats(nextSeats: number) {
    if (Number.isNaN(nextSeats)) {
      return;
    }

    setSeats(Math.min(Math.max(nextSeats, 1), maxSeats));
  }

  function handleSubmit(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    setShowConfirm(true);
  }

  async function handleConfirm() {
    setShowConfirm(false);
    setLoading(true);

    try {
      const bookingDto = {
        userName: name,
        userEmail: email,
        seats,
        eventId: event.id,
        eventName: event.name,
      };
      const result = await createBooking(bookingDto, token ?? undefined);
      onBookingSuccess?.();
      router.push(
        `/booking-success?bookingId=${result?.id ?? ""}&eventId=${event.id}&pricePerSeat=${event.price}&eventName=${encodeURIComponent(event.name)}&date=${encodeURIComponent(event.date)}&seats=${seats}&total=${total}`
      );
    } catch (error: unknown) {
      const raw = error instanceof Error ? error.message : "";
      const message =
        raw.replace(/^Booking failed:\s*\d+\s*/i, "") || "Booking failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn || !token) {
    return (
      <div className={styles.formwrapper}>
        <div className={styles.form}>
          <span className={styles.panelEyebrow}>Booking required</span>
          <h3>Login to reserve your seats</h3>
          <p className={styles.helperText}>
            Create an account or sign in to hold your seats, complete checkout, and keep every
            confirmation in one place.
          </p>
          <button type="button" onClick={() => router.push("/auth")}>
            Log in or register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formwrapper}>
      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <span className={styles.panelEyebrow}>Confirm reservation</span>
            <h3>Ready to book {event.name}?</h3>
            <p>
              {seats} seat{seats !== 1 ? "s" : ""} for <strong>SEK {total}</strong>.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={handleConfirm}>
                Yes, reserve now
              </button>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <span className={styles.panelEyebrow}>Reserve your place</span>
        <h3>Book your seats</h3>
        <p className={styles.helperText}>
          Review the details, choose your seat count, and reserve before checkout.
        </p>

        <div className={styles.summaryRow}>
          <div>
            <span>Price</span>
            <strong>SEK {event.price.toLocaleString("sv-SE")} / seat</strong>
          </div>
          <div>
            <span>Availability</span>
            <strong>
              {event.availableSeats} of {event.totalSeats} left
            </strong>
          </div>
        </div>

        <label htmlFor="bookingName">Full name</label>
        <input id="bookingName" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="bookingEmail">Email</label>
        <input
          id="bookingEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="bookingSeats">Seats</label>
        <div className={styles.seatControl}>
          <button
            type="button"
            className={styles.stepper}
            onClick={() => updateSeats(seats - 1)}
            disabled={seats <= 1}
          >
            -
          </button>
          <input
            id="bookingSeats"
            type="number"
            min="1"
            max={maxSeats}
            value={seats}
            onChange={(e) => updateSeats(Number(e.target.value))}
          />
          <button
            type="button"
            className={styles.stepper}
            onClick={() => updateSeats(seats + 1)}
            disabled={soldOut || seats >= maxSeats}
          >
            +
          </button>
        </div>

        <p className={styles.total}>Total: SEK {Number(total).toLocaleString("sv-SE")}</p>
        <p className={styles.secureNote}>Your reservation is created first, then payment follows.</p>

        <button type="submit" disabled={loading || soldOut}>
          {soldOut ? "Sold out" : loading ? "Processing..." : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}
