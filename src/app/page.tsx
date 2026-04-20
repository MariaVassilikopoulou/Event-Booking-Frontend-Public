import Link from "next/link";
import { ArrowRight, CalendarRange, ShieldCheck, Sparkles } from "lucide-react";
import styles from "../styles/HomePage.module.scss";
import AiModalTrigger from "@/components/AiModalTrigger";

const steps = [
  "Search by city or vibe — AI finds the right match.",
  "See live seats and price, then book in seconds.",
  "Confirmation hits your inbox instantly.",
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.kicker}>Event booking platform</span>

          <div className={styles.headlineBlock}>
            <h1>Find events. Book fast.</h1>
            <p className={styles.lead}>Browse, book, and pay in one place.</p>
          </div>

          <div className={styles.actionDock}>
            <AiModalTrigger className={styles.aiHeroCta}>
              <span className={styles.aiHeroTitle}>What&apos;s on near you?</span>
              <span className={styles.aiHeroHint}>Try AI search</span>
            </AiModalTrigger>
            <Link href="/events" className={styles.browseCta}>
              Browse events
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.metaStrip}>
            <div><Sparkles size={16} /><span>AI search</span></div>
            <div><CalendarRange size={16} /><span>Live availability</span></div>
            <div><ShieldCheck size={16} /><span>Secure checkout</span></div>
          </div>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.storyCopy}>
            <span className={styles.sectionEyebrow}>How it works</span>
            <h2>3 simple steps.</h2>
            <p>From discovery to confirmation.</p>
          </div>
          <div className={styles.stepList}>
            {steps.map((step, i) => (
              <div key={step} className={styles.stepItem}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={styles.ctaInner}>
          <div>
            <span className={styles.ctaEyebrow}>Ready to explore</span>
            <h2>See what&apos;s on.</h2>
          </div>
          <Link href="/events" className={styles.bandCta}>
            Browse events
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
