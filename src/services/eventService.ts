import { Event } from "@/types/globalTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_EVENTS;
if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_EVENTS in .env file");
}
export const getEvents = async (): Promise<Event[]| null> => {
  try{
  
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("Failed to fetch events:", response.status);
    return null;
  }

  return response.json();
} catch (error) {
  console.error("Error fetching in getEvents:", error);
  return null;
}
};

export const getEventsById = async (id: string): Promise<Event| null> => {
  try{
  const response = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    console.error(`Failed to fetch event ${id}:`, response.status, text);
    //throw new Error("Failed to fetch event details");
    return null;
  }
  return response.json();
  }catch(error){
    console.error(`Error fetching in getEventsById for id ${id}:`, error);
    return null;
  }
};