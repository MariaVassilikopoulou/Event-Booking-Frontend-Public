import { notFound } from 'next/navigation';
import { getEventsById } from "@/services/eventService";
import EventDetailsClient from "../../../components/EventDetailsClient"; 
import { Event } from "@/types/globalTypes";

interface PageProps {
    params: { id: string };
  }
export default async function EventDetailsPage({ params }: PageProps ) {
    
    const{ id } = params;
    let event: Event | null =  await getEventsById(id);
    
    try {
       
        event = await getEventsById(id);
    } catch (error) {
        console.error(`Failed to fetch event ${id}:`, error);
       
        notFound(); 
    }

   
    if (!event) {
        notFound();
    }
    
    
    return <EventDetailsClient  id={id}  />;
}