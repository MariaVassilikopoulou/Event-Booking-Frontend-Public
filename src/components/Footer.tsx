"use client";

import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";
import styles from "../styles/Footer.module.scss";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Footer() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <span className={styles.eyebrow}>Flowvent</span>
            <h2>Book your next experience.</h2>
            <p>Full-stack event platform — browse, book, and pay in one place. Powered by AI search and real-time availability.</p>
          </div>

          <Link href="/events" className={styles.cta}>
            Browse events
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.grid}>
          <div className={styles.column}>
            <h3>Explore</h3>
            <Link href="/">Home</Link>
            <Link href="/events">Events</Link>
            <Link href="/about">About</Link>
          </div>

          <div className={styles.column}>
            <h3>Account</h3>
            <Link href={isLoggedIn ? "/bookings" : "/auth"}>
              {isLoggedIn ? "My bookings" : "Login or register"}
            </Link>
            <Link href="/events">Book now</Link>
          </div>

          <div className={styles.column}>
            <h3>Built with</h3>
            <span className={styles.stackItem}>Next.js 15 · TypeScript</span>
            <span className={styles.stackItem}>.NET 10 · C#</span>
            <span className={styles.stackItem}>Azure OpenAI</span>
            <span className={styles.stackItem}>CosmosDB</span>
            <a
              href="https://www.instagram.com/flowvent_/"
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
            >
              <Instagram size={16} />
              Instagram
            </a>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p>© {new Date().getFullYear()} Flowvent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
