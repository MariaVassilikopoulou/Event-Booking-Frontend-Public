import { Event } from "@/types/globalTypes";

const BASE_URL = "/api/events";

export const getEvents = async (): Promise<Event[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export const getEventsById = async (id: string): Promise<Event> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch event details");
  }
  return response.json();
};