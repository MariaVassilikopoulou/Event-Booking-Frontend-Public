"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "../styles/AskAIButton.module.scss";
import ReactMarkdown from "react-markdown";
import { sendAiChatMessage, executeBooking } from "../services/aiAssistantService";
import { ChatMessage, BackendEvent, PendingBooking } from "../types/globalTypes";
import { useAuthStore } from "../stores/useAuthStore";

interface AskAIButtonProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AskAIButton({ setModalOpen }: AskAIButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  const handleOpen = () => {
    setOpen(true);
    setModalOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalOpen(false);
    setPendingBooking(null);
  };

  const handleSend = async (text?: string) => {
    const messageText = text ?? input;
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendAiChatMessage([...messages, userMessage]);
      const apiAnswer = data.answer;
      const normalizedEvents =
        apiAnswer?.recommendedEvents?.map((ev: BackendEvent, idx: number) => ({
          id: idx + 1,
          title: ev.Name ?? ev.name ?? "Untitled",
          date: ev.Date ?? ev.date ?? "Unknown date",
          location: ev.location ?? ev.Location ?? "Unknown location",
          price: ev.Price ?? ev.price ?? 0,
          seatsAvailable: ev.SeatsAvailable ?? ev.seatsAvailable ?? 0,
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
        console.log("[AI] pendingBooking received:", apiAnswer.pendingBooking);
        setPendingBooking(apiAnswer.pendingBooking);
        setSelectedSeats(apiAnswer.pendingBooking.seats ?? 1);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!pendingBooking) return;
    console.log("[AI] Confirming booking:", pendingBooking);
    setBookingLoading(true);
    try {
      const result = await executeBooking({
        eventId: pendingBooking.eventId,
        eventName: pendingBooking.eventName,
        seats: selectedSeats,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.message },
      ]);
      setPendingBooking(null);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Booking failed. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, the booking didn't go through: ${errorMsg}` },
      ]);
      setPendingBooking(null);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  const handleChipClick = (suggestion: string) => {
    if (!loading) handleSend(suggestion);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingBooking]);

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={handleOpen}>🔍 What&apos;s on near you?</button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Ask our AI Assistant</h2>
            <p>Discover live events in any city, get FlowEvent recommendations, or book your next event — right here.</p>

            <div className={styles.chatWindow}>
              {messages.length === 0 && (
                <div className={styles.emptyState}>
                  {isLoggedIn ? (
                    <div className={styles.featureCard}>
                      <p className={styles.featureCardTitle}>🎟️ I can book events for you</p>
                      <p className={styles.featureCardBody}>
                        Ask me about an event, say &quot;book it&quot;, and your spot is confirmed instantly —
                        a confirmation email lands in your inbox and the booking appears in My Bookings.
                      </p>
                    </div>
                  ) : (
                    <div className={styles.featureCard}>
                      <p className={styles.featureCardTitle}>🌍 Discover what&apos;s on in any city</p>
                      <p className={styles.featureCardBody}>
                        Ask me about events in Gothenburg, Stockholm, or anywhere — I pull live data and show
                        you what&apos;s happening, with direct links to buy tickets. Log in to also book
                        FlowEvent events instantly from this chat.
                      </p>
                    </div>
                  )}
                  <p className={styles.emptyGreeting}>👋 What are you looking for today?</p>
                  <div className={styles.chipsRow}>
                    {(isLoggedIn
                      ? ["Book me an event", "What's on this weekend?", "Show me cheap events"]
                      : ["What's on in Gothenburg?", "Live music in Stockholm", "Events in Malmö this weekend"]
                    ).map((s) => (
                      <button key={s} className={styles.chip} onClick={() => handleChipClick(s)} disabled={loading}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i}>
                  <div className={m.role === "user" ? styles.bubbleUser : styles.bubbleAI}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>

                    {m.recommendedEvents && m.recommendedEvents.length > 0 && (
                      <div className={styles.eventsGrid}>
                        {m.recommendedEvents.map((ev) => (
                          <div key={ev.id} className={styles.eventCard}>
                            <p className={styles.eventCardLocation}>{ev.location}</p>
                            <h4 className={styles.eventCardTitle}>{ev.title}</h4>
                            <div className={styles.eventCardMeta}>
                              <span>{new Date(ev.date).toLocaleDateString("en-SE", { day: "numeric", month: "short", year: "numeric" })}</span>
                              <span className={styles.eventCardPrice}>
                                {ev.price.toLocaleString("sv-SE")} SEK
                              </span>
                            </div>
                            {ev.seatsAvailable > 0 && (
                              <p className={styles.eventCardSeats}>{ev.seatsAvailable} seats available</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {m.role === "assistant" && i === messages.length - 1 && m.suggestions && m.suggestions.length > 0 && !pendingBooking && (
                    <div className={styles.chipsRow}>
                      {m.suggestions.map((s) => (
                        <button key={s} className={styles.chip} onClick={() => handleChipClick(s)} disabled={loading}>
                          {s}
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

              {/* Booking Confirmation Panel */}
              {pendingBooking && !bookingLoading && (
                <div className={styles.confirmPanel}>
                  <p className={styles.confirmTitle}>Confirm your booking</p>
                  <p className={styles.confirmDetail}><strong>{pendingBooking.eventName}</strong></p>
                  {pendingBooking.eventDate && <p className={styles.confirmDetail}>📅 {pendingBooking.eventDate}</p>}

                  <div className={styles.seatsStepper}>
                    <span className={styles.seatsLabel}>Seats</span>
                    <button
                      className={styles.stepperBtn}
                      onClick={() => setSelectedSeats(s => Math.max(1, s - 1))}
                      disabled={selectedSeats <= 1}
                    >−</button>
                    <span className={styles.seatsCount}>{selectedSeats}</span>
                    <button
                      className={styles.stepperBtn}
                      onClick={() => setSelectedSeats(s => s + 1)}
                    >+</button>
                  </div>

                  {pendingBooking.price > 0 && (
                    <p className={styles.confirmDetail}>
                      💰 {selectedSeats} × {pendingBooking.price.toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}
                      {" = "}
                      <strong>{(selectedSeats * pendingBooking.price).toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}</strong>
                    </p>
                  )}

                  <div className={styles.confirmActions}>
                    <button className={styles.confirmBtn} onClick={handleConfirmBooking}>
                      Confirm {selectedSeats} seat{selectedSeats > 1 ? "s" : ""}
                    </button>
                    <button className={styles.cancelBtn} onClick={() => setPendingBooking(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {bookingLoading && (
                <div className={styles.bubbleAI}><p>Booking your spot...</p></div>
              )}

              <div ref={scrollRef}></div>
            </div>

            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Send a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || !!pendingBooking}
              />
              <button onClick={() => handleSend()} disabled={loading || !input.trim() || !!pendingBooking}>
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
