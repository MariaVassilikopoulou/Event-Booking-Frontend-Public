"use client"

import { useEffect, useState } from "react";
import styles from "../styles/WarmUpBanner.module.scss";

const SLOW_THRESHOLD_MS = 3000;

export default function WarmUpBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), SLOW_THRESHOLD_MS);

        fetch(process.env.NEXT_PUBLIC_API_EVENTS ?? "", { method: "GET" })
            .then(() => {
                clearTimeout(timer);
                setVisible(false);
            })
            .catch(() => {
                clearTimeout(timer);
                setVisible(true);
            });

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className={styles.banner}>
            <span>
                The server is waking up (free tier) — this can take up to 30 seconds on first load.
                If something doesn&apos;t respond, just try again in a moment.
            </span>
            <button className={styles.close} onClick={() => setVisible(false)} aria-label="Dismiss">✕</button>
        </div>
    );
}
