import { notFound } from 'next/navigation';
import { getEventsById } from "@/services/eventService";
import EventDetailsClient from "../../../components/EventDetailsClient"; 
import { Event } from "@/types/globalTypes";

interface Params {
    params: { id: string };
  }

  export default async function EventDetailsPage({ params }: Params) {
    const { id } = params;
    let event: Event | null =  null;
    
    try {
       
        event = await getEventsById(id);
        if (!event) notFound();
    } catch (error) {
        console.error(`Failed to fetch event ${id}:`, error);
       
        notFound(); 
    }

   
    if (!event) {
        notFound();
    }
    
    
    return <EventDetailsClient  id={id}  />;
}