import { Event } from "@/types/globalTypes";


const BASE_URL =
  typeof window !== "undefined" ? "" : "http://localhost:3000";

export const getEvents= async(): Promise<Event[]>=>{
    const res = await fetch (`${BASE_URL}/api/events`);
    if (!res.ok) throw new Error("failed to fetch events");
    return res.json();
}


export const getEventsById= async(id: string):Promise<Event>=>{
    const res= await fetch (`${BASE_URL}/api/events/${id}`);
    if(!res.ok) throw new Error("Failed to fetch event");
    return res.json();
}