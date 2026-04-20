"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import styles from "../styles/Header.module.scss";
import { useAuthStore } from "@/stores/useAuthStore";

const primaryLinks = [
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, userName, isAdmin, logout } = useAuthStore();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Flowvent homepage">
          <span className={styles.brandMark}>Flowvent</span>
          <span className={styles.brandTag}>Event booking platform</span>
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`${styles.navShell} ${menuOpen ? styles.navOpen : ""}`}>
          <nav className={styles.nav} aria-label="Primary">
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}
            >
              Home
            </Link>
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            {isLoggedIn && userName && (
              <span className={styles.welcome}>
                <Sparkles size={14} />
                {userName}
              </span>
            )}

            {isLoggedIn && isAdmin && (
              <Link
                href="/admin"
                className={`${styles.secondaryAction} ${isActive("/admin") ? styles.activeAction : ""}`}
              >
                Admin
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <Link
                  href="/bookings"
                  className={`${styles.primaryAction} ${isActive("/bookings") ? styles.activeAction : ""}`}
                >
                  My Bookings
                </Link>
                <button onClick={logout} className={styles.ghostAction}>
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth" className={styles.primaryAction}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
