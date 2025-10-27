import Header from "@/components/Header";
import styles from "../styles/HomePage.module.scss";
import Link from "next/link";

export default function HomePage() {
    return (
      <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1>Welcome to GoEvent</h1>
          <p>Discover and book amazing events around you</p>
          <Link href="/events" className={styles.btn}>
            Book Now
          </Link>
        </div>
      </main>
    </div>
  );
  }