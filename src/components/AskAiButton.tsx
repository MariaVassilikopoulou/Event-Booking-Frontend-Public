"use client"

import { useState } from "react";
import styles from "../styles/AskAIButton.module.scss"
export default function AskAIButton() {
    // const handleClick = async () => {
    //   const result = await askEventAssistant({
    //     name: "Rock Concert",
    //     description: "Live show",
    //     location: "Stockholm",
    //     date: new Date().toISOString(),
    //     seatsAvailable: 100,
    //     price: 200,
    //     userQuestion: "Is this event good for families?"
    //   });
  
    //   console.log(result.answer);
    // };
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState("");
    const askAI = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setAnswer("");
        
        try {
            const res = await fetch("/api/ai-assistant", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userQuestion: question }),
            });
           
            if (!res.ok) {
                const text = await res.text();
                console.error("Backend error:", res.status, text);
                setAnswer("Something went wrong on the server.");
                return;
              }

            const data = await res.json();
            setAnswer(data.answer || "No response.");
          } catch {
            setAnswer("Something went wrong.");
          } finally {
            setLoading(false);
          }
        };
         

    return (
        <div className={styles.wrapper}>
        {/* The button */}
        <button className={styles.button} onClick={() => setOpen(true)}>
          💬 Ask the AI
        </button>
  
        {/* Modal */}
        {open && (
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <h2>Ask our AI Assistant</h2>
              <p>Get quick help about events, suggestions, or recommendations.</p>
  
              <textarea
                placeholder="Ask something..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
  
              <div className={styles.actions}>
                <button className={styles.close} onClick={() => setOpen(false)}>
                  Close
                </button>
  
                <button className={styles.ask} onClick={askAI} disabled={loading}>
                  {loading ? "Thinking..." : "Ask"}
                </button>
              </div>
  
              {answer && <div className={styles.answer}>{answer}</div>}
            </div>
          </div>
        )}
      </div>
    );
    
  }