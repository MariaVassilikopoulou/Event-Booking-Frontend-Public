import { Event } from "@/types/globalTypes";
import  styles from "../styles/EventCard.module.scss"
import Link from "next/link";
interface Props {
    event:Event;
}

export default function EventCard({event}:Props){
    return(
        <div className={styles.card}>
            <h2>{event.name}</h2>
            <p className={styles.location}>{event.location}</p>
            <div className={styles.details}>
                <p><strong>Date:</strong>{new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Seats:</strong>{event.availableSeats}/{event.totalSeats}</p>
                <p className={styles.price}>SEK{event.price}</p>
            </div>
            <Link href={`/events/${event.id}`} className={styles.button}>
              Book Now 
            </Link>
            
        </div>
    )
}