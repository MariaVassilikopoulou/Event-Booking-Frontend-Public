import { Event } from "@/types/globalTypes";
import styles from "../styles/EventCard.module.scss"
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

interface Props {
    event: Event;
}

export default function EventCard({ event }: Props) {
    const { isLoggedIn } = useAuthStore();
    const isSoldOut = event.availableSeats === 0;
    const isLow = event.availableSeats > 0 && event.availableSeats <= 5;

    return (
        <div className={styles.card}>
            {isSoldOut && (
                <div className={styles.soldOutOverlay} aria-label="Sold out">
                    <span>Sold Out</span>
                </div>
            )}

            <h2>{event.name}</h2>
            <p className={styles.location}>{event.location}</p>
            <div className={styles.details}>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-SE", { dateStyle: "medium" })}</p>
                <p><strong>Seats:</strong> {event.availableSeats}/{event.totalSeats}</p>
                <p className={styles.price}>SEK {event.price.toLocaleString()}</p>
            </div>

            {isLow && !isSoldOut && (
                <span className={styles.lowSeats}>Only {event.availableSeats} seat{event.availableSeats !== 1 ? "s" : ""} left!</span>
            )}

            {!isLoggedIn && !isSoldOut && (
                <div className={styles.banner}>
                    Please <a href="/auth"><strong>log in</strong></a> to book events.
                </div>
            )}

            {isSoldOut ? (
                <button className={styles.soldOutBtn} disabled aria-label="This event is sold out">
                    Sold Out
                </button>
            ) : isLoggedIn ? (
                <Link href={`/events/${event.id}`} className={styles.button}>
                    Book Now
                </Link>
            ) : (
                <button
                    className={`${styles.button} ${styles.disabled}`}
                    disabled
                    title="Please log in to book this event"
                >
                    Book Now
                </button>
            )}
        </div>
    );
}
