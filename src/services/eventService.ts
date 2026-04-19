import { Event } from "@/types/globalTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_EVENTS;

export interface CreateEventDto {
    name: string;
    description?: string;
    date: string;
    location: string;
    price: number;
    totalSeats: number;
}


export const getEvents= async(): Promise<Event[]>=>{
  if (!BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_EVENTS in .env file");
  }
    const res = await fetch (BASE_URL);
    if (!res.ok) throw new Error("failed to fetch events");
    return res.json();
}


export const createEvent = async (dto: CreateEventDto, token: string): Promise<Event> => {
    const res = await fetch(BASE_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const updateEvent = async (id: string, dto: CreateEventDto, token: string): Promise<Event> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const deleteEvent = async (id: string, token: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
};

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
