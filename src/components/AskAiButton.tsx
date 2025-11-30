"use client"

import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/AskAIButton.module.scss";
import ReactMarkdown from "react-markdown";

interface AskAIButtonProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AskAIButton({ modalOpen, setModalOpen }: AskAIButtonProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setModalOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalOpen(false);
  };

  const askAI = async (userQuestion: string) => {
    const cacheKey = `aiCache:${userQuestion.toLowerCase().trim()}`;

    const cachedAnswer= localStorage.getItem(cacheKey);
    
    if (cachedAnswer){ 
    setAnswer(cachedAnswer);
    return;}
    setLoading(true);

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
      const aiAnswer = data.answer || "No response";
      //setAnswer(data.answer || "No response.");
      localStorage.setItem(cacheKey,aiAnswer);
      setAnswer(aiAnswer);
    } catch {
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={handleOpen}>
        💬 Ask the AI
      </button>

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
              <button className={styles.close} onClick={handleClose}>
                Close
              </button>

              <button className={styles.ask} onClick={()=>askAI(question)} disabled={loading}>
                {loading ? "Thinking..." : "Ask"}
              </button>
            </div>

            {answer && <div className={styles.answer}>
              <ReactMarkdown>{answer}</ReactMarkdown></div>}
          </div>
        </div>
      )}
    </div>
  );
}