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
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_AI_ASSISTANT;
  
  export async function askEventAssistant(
    data: AskEventRequest
  ): Promise<AskEventResponse> {
    if (!BASE_URL) throw new Error("Missing NEXT_PUBLIC_API_AI_ASSISTANT");
  
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
  