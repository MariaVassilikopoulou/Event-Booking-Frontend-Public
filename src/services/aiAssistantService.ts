import { ChatMessage, BackendEvent, PendingBooking } from "../types/globalTypes";
import { useAuthStore } from "../stores/useAuthStore";

interface AskEventRequest {
    name: string;
    description: string;
    location: string;
    date: string;
    seatsAvailable: number;
    price: number;
    totalEvents: number;
    userQuestion: string;
  }
  
  interface AskEventResponse {
    answer: string;
  }
  
  const BASE_URL = "/api/ai-assistant";
  
  export async function askEventAssistant(
    data: AskEventRequest
  ): Promise<AskEventResponse> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error("AI assistant API error");
    }
  
    return response.json();
  }

  export async function generateEventDescription(dto: {
    eventName: string;
    location: string;
    date: string;
    price: string;
  }, token: string): Promise<string> {
    const response = await fetch("/api/ai-assistant/generate-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        EventName: dto.eventName,
        Location: dto.location,
        Date: dto.date,
        Price: dto.price,
      }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.description ?? "";
  }

  export async function sendAiChatMessage(
    messages: ChatMessage[]
  ): Promise<{ answer: { answerText?: string; recommendedEvents?: BackendEvent[]; suggestions?: string[]; pendingBooking?: PendingBooking } }> {
    const token = useAuthStore.getState().token;
    const response = await fetch("/api/ai-assistant/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          Role: m.role,
          Content: m.content ?? "",
        })),
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  export async function executeBooking(dto: {
    eventId: string;
    eventName: string;
    seats: number;
  }): Promise<{ message: string; bookingId?: string }> {
    const token = useAuthStore.getState().token;
    const response = await fetch("/api/ai-assistant/execute-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        EventId: dto.eventId,
        EventName: dto.eventName,
        Seats: dto.seats,
      }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message ?? "Booking failed");
    }
    return response.json();
  }
