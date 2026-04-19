import { Event } from "@/types/globalTypes";
import { useAuthStore } from "@/stores/useAuthStore";

export async function semanticSearch(query: string): Promise<Event[]> {
  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getRecommendedEvents(): Promise<Event[]> {
  const token = useAuthStore.getState().token;
  if (!token) return [];

  const res = await fetch("/api/recommendations", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}
