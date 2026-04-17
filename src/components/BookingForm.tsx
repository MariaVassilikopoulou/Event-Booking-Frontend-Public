import { Event } from "@/types/globalTypes";
import { useEffect, useState } from "react";
import styles from "../styles/BookingForm.module.scss";
import { createBooking } from "@/services/bookingService";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface Props{
    event:Event;
    onBookingSuccess?: () => void;
}

export default function BookingForm({event, onBookingSuccess}: Props){
   const { userName: storedName, userEmail: storedEmail, isLoggedIn, token } = useAuthStore();
   const [name, setName] = useState(storedName ?? "");
   const [email, setEmail] = useState(storedEmail ?? "");
   const [seats, setSeats] = useState(1);
   const [loading, setLoading] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const total = (event.price * seats).toFixed(2);
   const router = useRouter();

   useEffect(() => {
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
   }, [storedName, storedEmail]);

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
   };

   const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const bookingDto = {
        userName: name,
        userEmail: email,
        seats,
        eventId: event.id,
        eventName: event.name
      };
      const result = await createBooking(bookingDto, token ?? undefined);
      onBookingSuccess?.();
      router.push(
        `/booking-success?bookingId=${result?.id ?? ""}&eventId=${event.id}&pricePerSeat=${event.price}&eventName=${encodeURIComponent(event.name)}&date=${encodeURIComponent(event.date)}&seats=${seats}&total=${total}`
      );
    } catch(error: unknown) {
      const raw = error instanceof Error ? error.message : "";
      const msg = raw.replace(/^Booking failed:\s*\d+\s*/i, "") || "Booking failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
   };

   if (!isLoggedIn || !token) {
    return (
      <div className={styles.formwrapper}>
        <div className={styles.form}>
          <h3>Book Your Seats</h3>
          <p>You need to be logged in to book this event.</p>
          <button type="button" onClick={() => router.push("/auth")}>Log in / Register</button>
        </div>
      </div>
    );
   }

   return (
    <div className={styles.formwrapper}>
      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Booking</h3>
            <p><strong>Event:</strong> {event.name}</p>
            <p><strong>Seats:</strong> {seats}</p>
            <p><strong>Total:</strong> {total} SEK</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={handleConfirm}>Yes, Book</button>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <h3>Book Your Seats</h3>

        <label htmlFor="bookingName">Full Name</label>
        <input id="bookingName" value={name} onChange={e => setName(e.target.value)} required />

        <label htmlFor="bookingEmail">Email</label>
        <input id="bookingEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label htmlFor="bookingSeats">Number of Seats</label>
        <input
          id="bookingSeats"
          type="number"
          min="1"
          max={event.availableSeats}
          value={seats}
          onChange={e => setSeats(Number(e.target.value))}
        />

        <p className={styles.total}>Total: {total} SEK</p>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}



