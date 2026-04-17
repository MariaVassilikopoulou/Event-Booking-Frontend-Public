"use client"

import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import styles from "../../styles/BookingSuccessPage.module.scss"
import { useAuthStore } from "@/stores/useAuthStore"

function PaymentSuccessContent() {
    const params = useSearchParams();
    const sessionId = params.get("session_id");
    const { token } = useAuthStore();
    const [status, setStatus] = useState<"loading" | "paid" | "error">("loading");

    useEffect(() => {
        if (!sessionId || !token) {
            setStatus("paid"); // no session to verify, just show success
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_PAYMENT}/verify-session`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ sessionId }),
                    }
                );
                if (res.ok) {
                    setStatus("paid");
                } else {
                    setStatus("error");
                }
            } catch {
                setStatus("error");
            }
        };

        verify();
    }, [sessionId, token]);

    if (status === "loading") {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.wrapper}>
                    <h1>Confirming payment…</h1>
                    <p>Please wait while we confirm your payment.</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.wrapper}>
                    <h1>Something went wrong</h1>
                    <p>We could not confirm your payment. Please check your bookings or contact support.</p>
                    <div className={styles.actions}>
                        <Link href="/bookings" className={styles.bookingsLink}>View My Bookings</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.wrapper}>
                <h1>Payment Successful!</h1>
                <h2>Your booking is confirmed and seats are secured.</h2>
                <p>A payment confirmation email has been sent to your inbox.</p>
                <div className={styles.actions}>
                    <Link href="/bookings" className={styles.bookingsLink}>View My Bookings</Link>
                    <Link href="/" className={styles.backLink}>Back to Events</Link>
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
