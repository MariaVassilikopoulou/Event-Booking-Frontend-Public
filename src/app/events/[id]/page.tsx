import { notFound } from 'next/navigation';
import { getEventsById } from "@/services/eventService";
import EventDetailsClient from "../../../components/EventDetailsClient"; // Import the client component
import { Event } from "@/types/globalTypes";


export default async function EventDetailsPage({ params }: { params:Promise<{ id: string }> }) {
    
    const{ id } = await params;
    let event: Event | null = null;
    
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