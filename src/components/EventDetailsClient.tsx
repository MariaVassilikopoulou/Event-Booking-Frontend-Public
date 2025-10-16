"use client"

import { Event } from "@/types/globalTypes";
import { useState, useEffect } from "react";
import styles from "../styles/EventCard.module.scss"
import BookingForm from "@/components/BookingForm";
import { getEventsById } from "@/services/eventService";



export default function EventDetailsPage({id}:{id:string}){
   
    const [event, setEvent]= useState<Event| null>(null);


    useEffect(()=>{
        if (!id) return;
        getEventsById(id).then(setEvent).catch(console.error);
    },[id]);
        

    if(!event) return<p>Loading....</p>;

    return(
        <div className={styles.details}>
            <h1>{event.name}</h1>
            <p><strong>Date:</strong>{new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong>{event.location}</p>
            <p><strong>Price:</strong>{event.price}SEK</p>
            <BookingForm event={event}/>
        </div>
    )

}