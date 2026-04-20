"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../../styles/BookingSuccessPage.module.scss";
import { useAuthStore } from "@/stores/useAuthStore";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { token } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "paid" | "error">("loading");

  useEffect(() => {
    if (!sessionId || !token) {
      setStatus("paid");
      return;
    }

    async function verify() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PAYMENT}/verify-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          setStatus("paid");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    verify();
  }, [sessionId, token]);

  if (status === "loading") {
    return (
      <div className={styles.pageBackground}>
        <div className={styles.wrapper}>
          <span className={styles.pendingBadge}>Confirming payment</span>
          <div className={styles.orb}></div>
          <h1>Confirming payment...</h1>
          <p className={styles.lead}>Please wait.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.pageBackground}>
        <div className={styles.wrapper}>
          <span className={styles.errorBadge}>Payment needs attention</span>
          <div className={styles.orb}></div>
          <h1>Payment not confirmed.</h1>
          <p className={styles.lead}>Please check your bookings.</p>
          <div className={styles.actions}>
            <Link href="/bookings" className={styles.bookingsLink}>
              My bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.wrapper}>
        <span className={styles.successBadge}>Payment complete</span>
        <div className={styles.orb}></div>
        <h1>Payment complete.</h1>
        <p className={styles.lead}>Your booking is confirmed.</p>
        <div className={styles.actions}>
          <Link href="/bookings" className={styles.bookingsLink}>
            My bookings
          </Link>
          <Link href="/events" className={styles.backLink}>
            Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
