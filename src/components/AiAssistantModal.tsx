"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../styles/AskAIButton.module.scss";
import { sendAiChatMessage, executeBooking } from "../services/aiAssistantService";
import { ChatMessage, BackendEvent, PendingBooking } from "../types/globalTypes";
import { useAuthStore } from "../stores/useAuthStore";
import { useAiModalStore } from "@/stores/useAiModalStore";

export default function AiAssistantModal() {
  const isOpen = useAiModalStore((state) => state.isOpen);
  const close = useAiModalStore((state) => state.close);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleClose = useCallback(() => {
    close();
    setPendingBooking(null);
  }, [close]);

  const handleSend = async (text?: string) => {
    const messageText = text ?? input;
    if (!messageText.trim()) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendAiChatMessage([...messages, userMessage]);
      const apiAnswer = data.answer;
      const normalizedEvents =
        apiAnswer?.recommendedEvents?.map((event: BackendEvent, idx: number) => ({
          id: idx + 1,
          title: event.Name ?? event.name ?? "Untitled",
          date: event.Date ?? event.date ?? "Unknown date",
          location: event.location ?? event.Location ?? "Unknown location",
          price: event.Price ?? event.price ?? 0,
          seatsAvailable: event.SeatsAvailable ?? event.seatsAvailable ?? 0,
        })) || [];

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: apiAnswer?.answerText ?? "No response",
        recommendedEvents: normalizedEvents,
        suggestions: apiAnswer?.suggestions ?? [],
        pendingBooking: apiAnswer?.pendingBooking ?? undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (apiAnswer?.pendingBooking) {
        setPendingBooking(apiAnswer.pendingBooking);
        setSelectedSeats(apiAnswer.pendingBooking.seats ?? 1);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!pendingBooking) {
      return;
    }

    setBookingLoading(true);
    try {
      const result = await executeBooking({
        eventId: pendingBooking.eventId,
        eventName: pendingBooking.eventName,
        seats: selectedSeats,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: result.message }]);
      setPendingBooking(null);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Booking failed. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, the booking didn't go through: ${errorMsg}` },
      ]);
      setPendingBooking(null);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !loading) {
      handleSend();
    }
  };

  const handleChipClick = (suggestion: string) => {
    if (!loading) {
      handleSend(suggestion);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingBooking]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleClose, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={(event) => event.target === event.currentTarget && handleClose()}>
      <div className={styles.modal}>
        <h2>Ask AI</h2>
        <p>Find events near you or search by city, date, or price.</p>

        <div className={styles.chatWindow}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              {isLoggedIn ? (
                <div className={styles.featureCard}>
                  <p className={styles.featureCardTitle}>Book in chat</p>
                  <p className={styles.featureCardBody}>Ask about an event, then book it here.</p>
                </div>
              ) : (
                <div className={styles.featureCard}>
                  <p className={styles.featureCardTitle}>Search events</p>
                  <p className={styles.featureCardBody}>Ask what&apos;s on in any city.</p>
                </div>
              )}
              <p className={styles.emptyGreeting}>What are you looking for?</p>
              <div className={styles.chipsRow}>
                {(isLoggedIn
                  ? ["Book me an event", "What's on this weekend?", "Cheap events"]
                  : ["What's on in Gothenburg?", "Live music in Stockholm", "Events in Malmö"]
                ).map((suggestion) => (
                  <button
                    key={suggestion}
                    className={styles.chip}
                    onClick={() => handleChipClick(suggestion)}
                    disabled={loading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index}>
              <div className={message.role === "user" ? styles.bubbleUser : styles.bubbleAI}>
                <ReactMarkdown>{message.content}</ReactMarkdown>

                {message.recommendedEvents && message.recommendedEvents.length > 0 && (
                  <div className={styles.eventsGrid}>
                    {message.recommendedEvents.map((event) => (
                      <div key={event.id} className={styles.eventCard}>
                        <p className={styles.eventCardLocation}>{event.location}</p>
                        <h4 className={styles.eventCardTitle}>{event.title}</h4>
                        <div className={styles.eventCardMeta}>
                          <span>
                            {new Date(event.date).toLocaleDateString("en-SE", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className={styles.eventCardPrice}>
                            {event.price.toLocaleString("sv-SE")} SEK
                          </span>
                        </div>
                        {event.seatsAvailable > 0 && (
                          <p className={styles.eventCardSeats}>{event.seatsAvailable} seats</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {message.role === "assistant" &&
                index === messages.length - 1 &&
                message.suggestions &&
                message.suggestions.length > 0 &&
                !pendingBooking && (
                  <div className={styles.chipsRow}>
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        className={styles.chip}
                        onClick={() => handleChipClick(suggestion)}
                        disabled={loading}
                      >
                        {suggestion}
                      </button>
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

          {pendingBooking && !bookingLoading && (
            <div className={styles.confirmPanel}>
              <p className={styles.confirmTitle}>Confirm booking</p>
              <p className={styles.confirmDetail}>
                <strong>{pendingBooking.eventName}</strong>
              </p>
              {pendingBooking.eventDate && (
                <p className={styles.confirmDetail}>Date: {pendingBooking.eventDate}</p>
              )}

              <div className={styles.seatsStepper}>
                <span className={styles.seatsLabel}>Seats</span>
                <button
                  className={styles.stepperBtn}
                  onClick={() => setSelectedSeats((seats) => Math.max(1, seats - 1))}
                  disabled={selectedSeats <= 1}
                >
                  -
                </button>
                <span className={styles.seatsCount}>{selectedSeats}</span>
                <button className={styles.stepperBtn} onClick={() => setSelectedSeats((seats) => seats + 1)}>
                  +
                </button>
              </div>

              {pendingBooking.price > 0 && (
                <p className={styles.confirmDetail}>
                  {selectedSeats} x{" "}
                  {pendingBooking.price.toLocaleString("sv-SE", {
                    style: "currency",
                    currency: "SEK",
                  })}{" "}
                  ={" "}
                  <strong>
                    {(selectedSeats * pendingBooking.price).toLocaleString("sv-SE", {
                      style: "currency",
                      currency: "SEK",
                    })}
                  </strong>
                </p>
              )}

              <div className={styles.confirmActions}>
                <button className={styles.confirmBtn} onClick={handleConfirmBooking}>
                  Confirm
                </button>
                <button className={styles.cancelBtn} onClick={() => setPendingBooking(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {bookingLoading && (
            <div className={styles.bubbleAI}>
              <p>Booking...</p>
            </div>
          )}

          <div ref={scrollRef}></div>
        </div>

        <div className={styles.inputRow}>
          <input
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || !!pendingBooking}
          />
          <button onClick={() => handleSend()} disabled={loading || !input.trim() || !!pendingBooking}>
            {loading ? "..." : "Send"}
          </button>
        </div>

        <button className={styles.close} onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
}
