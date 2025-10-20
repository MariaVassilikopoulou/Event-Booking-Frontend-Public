"use client"

import { Event } from "@/types/globalTypes";
import { useState, useEffect } from "react";
import styles from "../styles/EventCard.module.scss"
import BookingForm from "@/components/BookingForm";
import { getEventsById } from "@/services/eventService";



export default function EventDetailsPage({id}:{id:string}){
   
    const [event, setEvent]= useState<Event| null>(null);

    

     // Function to refetch event data from backend
  const fetchEvent = async () => {
    try {
      const data = await getEventsById(id);
      setEvent(data);
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  };

  // Fetch event on page load
  useEffect(() => {
    if (!id) return;
    fetchEvent();
  }, [id]);

        

    if(!event) return<p>Loading....</p>;

    return(
        <div className={styles.details}>
            <h1>{event.name}</h1>
            <p><strong>Date:</strong>{new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong>{event.location}</p>
            <p><strong>Price:</strong>{event.price}SEK</p>
            <BookingForm event={event}  onBookingSuccess={fetchEvent}/>
        </div>
    )

}