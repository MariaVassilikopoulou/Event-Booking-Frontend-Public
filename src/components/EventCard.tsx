import { Event } from "@/types/globalTypes";
import styles from "../styles/EventCard.module.scss";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const { isLoggedIn } = useAuthStore();
  const isSoldOut = event.availableSeats === 0;
  const isLow = event.availableSeats > 0 && event.availableSeats <= 5;
  const formattedDate = new Date(event.date).toLocaleDateString("en-SE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <article className={styles.card}>
      {isSoldOut && (
        <div className={styles.soldOutOverlay} aria-label="Sold out">
          <span>Sold out</span>
        </div>
      )}

      <h2>{event.name}</h2>
      <p className={styles.location}>{event.location}</p>

      <div className={styles.cardMeta}>
        <span>{formattedDate}</span>
        {isLow && <span className={styles.metaLow}>Selling fast</span>}
      </div>

      <p className={styles.price}>SEK {event.price.toLocaleString("sv-SE")}</p>

      {isSoldOut ? (
        <button className={styles.soldOutBtn} disabled aria-label="This event is sold out">
          Sold out
        </button>
      ) : isLoggedIn ? (
        <Link href={`/events/${event.id}`} className={styles.button}>
          Book now
        </Link>
      ) : (
        <Link href="/auth" className={styles.button}>
          Login to book
        </Link>
      )}
    </article>
  );
}
