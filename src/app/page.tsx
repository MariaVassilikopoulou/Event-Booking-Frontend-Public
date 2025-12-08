"use client"
import AskAIButton from "@/components/AskAiButton";
import styles from "../styles/HomePage.module.scss";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={`${styles.wrapper} ${modalOpen ? styles["modal-open"] : ""}`}>
      <div className={styles.card}>
        <h1>Welcome to Flowvent</h1>
        <p>Discover and book amazing events around you</p>
        <Link href="/events" className={styles.btn}>
          Book Now
        </Link>
        <AskAIButton modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </div>
    </div>
  );
  }