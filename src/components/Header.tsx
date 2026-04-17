"use client"

import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Header.module.scss"
import { useAuthStore } from "@/stores/useAuthStore";

export default function Header(){
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, userName, isAdmin, logout } = useAuthStore();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/">Flowvent</Link>
            </div>

            <button
                className={styles.hamburger}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                <span className={menuOpen ? styles.barOpen : styles.bar} />
                <span className={menuOpen ? styles.barHidden : styles.bar} />
                <span className={menuOpen ? styles.barOpen : styles.bar} />
            </button>

            <nav className={`${styles.right} ${menuOpen ? styles.navOpen : ""}`}>
                {isLoggedIn ? (
                    <>
                        <span className={styles.welcome}>Welcome, {userName}</span>
                        {isAdmin && <Link href="/admin" className={styles.navLink}>Admin</Link>}
                        <Link href="/bookings" className={styles.navLink}>My Bookings</Link>
                        <button onClick={logout} className={styles.logout}>Logout</button>
                    </>
                ) : (
                    <Link href="/auth" className={styles.loginButton}>Login</Link>
                )}
            </nav>
        </header>
    );
}