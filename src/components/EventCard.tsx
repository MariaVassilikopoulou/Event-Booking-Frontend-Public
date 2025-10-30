import { Event } from "@/types/globalTypes";
import  styles from "../styles/EventCard.module.scss"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
interface Props {
    event:Event;
}

export default function EventCard({event}:Props){
    const {isLoggedIn} = useAuthStore();

    /*useEffect(() => {
        setIsLoggedIn(Boolean(localStorage.getItem("userToken")));
      }, []);*/
    return(
        <div className={styles.card}>
           
            <h2>{event.name}</h2>
            <p className={styles.location}>{event.location}</p>
            <div className={styles.details}>
                <p><strong>Date:</strong>{new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Seats:</strong>{event.availableSeats}/{event.totalSeats}</p>
                <p className={styles.price}>SEK{event.price}</p>
            </div>
            {!isLoggedIn && (
            <div className={styles.banner}>
                Please <a href="/login"><strong>log in</strong></a> to book events.
             </div>)}
             {isLoggedIn ? (
            <Link href={`/events/${event.id}`} className={styles.button}>
              Book Now 
            </Link>
            ):(
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