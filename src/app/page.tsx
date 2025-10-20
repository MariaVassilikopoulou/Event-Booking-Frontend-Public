import styles from "../styles/EventCard.module.scss"
import Link from "next/link";

export default function HomePage() {
    return (
      <div>
        <h1>Welcome to Event Booking</h1>
        <Link href={`/events`} className={styles.button}>
              Book Now 
            </Link>
      </div>
    );
  }