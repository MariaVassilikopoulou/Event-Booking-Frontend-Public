"use client"

import { Event } from "@/types/globalTypes";
import { useState, useEffect } from "react";
import styles from "../styles/EventDetails.module.scss"
import BookingForm from "@/components/BookingForm";
import { getEventsById } from "@/services/eventService";
import { Calendar, MapPin, Users } from "lucide-react";



export default function EventDetailsPage({id}:{id:string}){
   
    const [event, setEvent]= useState<Event| null>(null);

    


  const fetchEvent = async () => {
    try {
      const data = await getEventsById(id);
      setEvent(data);
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  };

  
  useEffect(() => {
    if (!id) return;
    fetchEvent();
  }, [id]);

        

  if (!event) return <p className={styles.loading}>Loading event details...</p>;

  return (
    <div className={styles.detailsPage}>
    
      <div className={styles.eventInfo}>
        <h1>{event.name}</h1>
        <p className={styles.subtitle}>
          Watch promising startups pitch their ideas to investors and network with entrepreneurs.
        </p>

        <div className={styles.infoRow}>
          <Calendar size={18} />
          <span>{new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>

        <div className={styles.infoRow}>
          <MapPin size={18} />
          <span>{event.location}</span>
        </div>

        <div className={styles.infoRow}>
          <Users size={18} />
          <span>{event.availableSeats} / {event.totalSeats} seats available</span>
        </div>

        <p className={styles.price}>
          {event.price} SEK
          <span> per seat</span>
        </p>
      </div>

      <div className={styles.bookingFormWrapper}>
        <BookingForm event={event} onBookingSuccess={fetchEvent} />
      </div>
    </div>
  );
}
   