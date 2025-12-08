import { ChatMessage, BackendEvent } from "../types/globalTypes";

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

  export async function sendAiChatMessage(
    messages: ChatMessage[]
  ): Promise<{ answer: { answerText?: string; recommendedEvents?: BackendEvent[] } }> {
    const response = await fetch("/api/ai-assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
