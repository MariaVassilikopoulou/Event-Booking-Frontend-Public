"use client";

import { Sparkles } from "lucide-react";
import styles from "../styles/AskAIButton.module.scss";
import AiModalTrigger from "./AiModalTrigger";

export default function GlobalAiButton() {
  return (
    <div className={styles.wrapper}>
      <AiModalTrigger className={`${styles.button} ${styles.floatingButton}`}>
        <Sparkles size={16} />
        What&apos;s on near you?
      </AiModalTrigger>
    </div>
  );
}
