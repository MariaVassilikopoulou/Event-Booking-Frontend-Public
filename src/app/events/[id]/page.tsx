import { notFound } from 'next/navigation';
import { getEventsById } from "@/services/eventService";
 
import { Event } from "@/types/globalTypes";
import EventDetailsClient from '@/components/EventDetailsClient';

interface Params {
    params: { id: string };
  }
  export const dynamic = "force-dynamic";
  export default async function EventDetailsPage({ params }: Params) {
    const { id } = params;
    let event: Event | null =  null;
    
    try {
       
        event = await getEventsById(id);
      
    } catch (error) {
        console.error(`Failed to fetch event ${id}:`, error);
       
       
    }

   
    if (!event) {
        return notFound();
    }
    
    
    return <EventDetailsClient  id={id}  />;
}