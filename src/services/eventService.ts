import { Event } from "@/types/globalTypes";


const BASE_URL =process.env.NEXT_PUBLIC_API_EVENTS;
 

export const getEvents= async(): Promise<Event[]>=>{
  if (!BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_EVENTS in .env file");
  }
    const res = await fetch (BASE_URL);
    if (!res.ok) throw new Error("failed to fetch events");
    return res.json();
}


export const getEventsById= async(id: string):Promise<Event>=>{
    const res= await fetch (`${BASE_URL}/${id}`);
    if(!res.ok) throw new Error("Failed to fetch event");
    return res.json();
}