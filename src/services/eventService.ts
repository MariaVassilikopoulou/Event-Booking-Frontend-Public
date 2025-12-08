import { Event } from "@/types/globalTypes";


const BASE_URL =process.env.NEXT_PUBLIC_API_EVENTS;
console.log("PRODUCTION BASE_URL:", BASE_URL);


export const getEvents= async(): Promise<Event[]>=>{
  if (!BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_EVENTS in .env file");
  }
    const res = await fetch (BASE_URL);
    if (!res.ok) throw new Error("failed to fetch events");
    return res.json();
}


export const getEventsById = async (id: string): Promise<Event | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });

    if (!res.ok) {
      console.error("Failed to fetch event:", res.status);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error("getEventsById error:", err);
    return null;
  }
};
