import { Event } from "@/types/globalTypes";

const BASE_URL = "/api/events";

export const getEvents = async (): Promise<Event[]| null> => {
  try{
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();}
  catch(error){
    console.error("Error fetching in getEvents:", error);
    return null;
  }
};

export const getEventsById = async (id: string): Promise<Event| null> => {
  try{
  const response = await fetch(`${BASE_URL}/${id}`);
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