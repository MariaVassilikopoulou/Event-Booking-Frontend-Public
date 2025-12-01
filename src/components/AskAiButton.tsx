"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "../styles/AskAIButton.module.scss";
import ReactMarkdown from "react-markdown";

interface AskAIButtonProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  recommendedEvents?: NormalizedEvent[];
}
interface BackendEvent {
  Name?: string;
  Location?: string;
  Date?: string;
  Price?: number;
  SeatsAvailable: number;
  name?: string;
  date?: string;
  location?: string;
  price?: number;
  seatsAvailable?: number;
}

interface NormalizedEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  seatsAvailable: number;
}

export default function AskAIButton({ modalOpen, setModalOpen }: AskAIButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setModalOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("api/ai-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            Role: m.role,
            Content: m.content ?? "",
          })),
        }),
      });
     

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
  // Normalize backend data to frontend structure
  const apiAnswer = data.answer;

  const normalizedEvents =
    apiAnswer?.recommendedEvents?.map((ev:  BackendEvent, idx: number) => ({
      id: idx + 1, // generate an id if backend has none
      title: ev.Name ?? ev.name  ?? "Untitled",
      date: ev.Date  ?? ev.date  ?? "Unknown date",
      location: ev.location  ?? ev.Location  ?? "Unknown location",
      price: ev.Price  ?? ev.price  ?? 0,
      seatsAvailable: ev.SeatsAvailable  ?? ev.seatsAvailable  ?? 0,
    })) || [];


      const aiMessage: ChatMessage = {
        role: "assistant",
         content: apiAnswer?.answerText ?? "No response",
        recommendedEvents: normalizedEvents,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error sending message:",err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={handleOpen}>💬 Ask the AI</button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Ask our AI Assistant</h2>
            <p>Get quick help about events, suggestions, or recommendations.</p>

            {/* CHAT WINDOW */}
            <div className={styles.chatWindow}>

            {messages.length === 0 && (
                <div className={styles.emptyState}>
                  <p>👋 Hi! Ask me anything about our events!</p>
                  <p>Try: What is the cheapest event? or Show me cooking workshops</p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? styles.bubbleUser : styles.bubbleAI}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>

                  {m.recommendedEvents && (
                    <div className={styles.eventsGrid}>
                      {m.recommendedEvents.map((ev) => (
                        <div key={ev.id} className={styles.eventCard}>
                          <h4>{ev.title}</h4>
                          <p>📍 {ev.location}</p>
                          <p>📅 {new Date(ev.date).toLocaleDateString()}</p>
                          <p>💰 ${ev.price}</p>
                          <p>🎟️ {ev.seatsAvailable} seats available</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

                {loading && (
                <div className={styles.bubbleAI}>
                  <p>Thinking...</p>
                </div>
              )}
              <div ref={scrollRef}></div>
            </div>

            {/* INPUT AREA */}
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Send a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button onClick={handleSend} disabled={loading || !input.trim()}>
                {loading ? "..." : "Send"}
              </button>
            </div>

            <button className={styles.close} onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
