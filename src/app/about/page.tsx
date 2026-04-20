"use client";

import Link from "next/link";
import styles from "../../styles/AboutPage.module.scss";

const techStack = [
  "Frontend: React, Next.js, TypeScript, SCSS",
  "Backend: .NET 8, C#, Azure Functions",
  "Database and cloud: Azure Cosmos DB, SQL, Azure Service Bus",
  "CI/CD and DevOps: GitHub, Azure DevOps",
  "Security: JWT authentication and cloud-first best practices",
  "AI integration: Azure OpenAI-powered event search",
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>About Flowvent</span>
        <h1>Simple event search and booking.</h1>
        <p>Find events and book online.</p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Our mission</h2>
          <p>Make event booking simple.</p>
        </article>

        <article className={styles.card}>
          <h2>AI assistant</h2>
          <p>Ask about dates, places, or prices.</p>
          <p className={styles.example}>
            Try: “What&apos;s happening in Gothenburg next month?”
          </p>
        </article>
      </section>

      <section className={styles.stackSection}>
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>Tech stack</span>
          <h2>Built with modern tools.</h2>
        </div>

        <div className={styles.stackGrid}>
          {techStack.map((item) => (
            <div key={item} className={styles.stackCard}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <span className={styles.eyebrow}>Start exploring</span>
          <h2>See what&apos;s live on Flowvent right now.</h2>
        </div>
        <Link href="/events">Browse upcoming events</Link>
      </section>
    </div>
  );
}
