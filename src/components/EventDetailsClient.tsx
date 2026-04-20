"use client";

import { ArrowLeft, Calendar, MapPin, Sparkles, Ticket, Users } from "lucide-react";
import { Event } from "@/types/globalTypes";
import styles from "../styles/EventDetails.module.scss";
import BookingForm from "@/components/BookingForm";
import Link from "next/link";

function getAvailabilityLabel(event: Event) {
  if (event.availableSeats === 0) {
    return "Currently sold out";
  }

  if (event.availableSeats <= 5) {
    return "Selling fast";
  }

  return "Seats available";
}

export default function EventDetailsClient({ initialEvent }: { initialEvent: Event }) {
  const event = initialEvent;
  const formattedDate = new Date(event.date).toLocaleDateString("en-SE", { dateStyle: "long" });
  const summary =
    event.description?.trim() ||
    "See details and book online.";

  return (
    <div className={styles.page}>
      <Link href="/events" className={styles.backLink}>
        <ArrowLeft size={15} />
        All events
      </Link>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eventInfo}>
            <span className={styles.eyebrow}>Event details</span>
            <h1>{event.name}</h1>
            <p className={styles.subtitle}>{summary}</p>

            <div className={styles.metaGrid}>
              <div className={styles.infoCard}>
                <Calendar size={18} />
                <div>
                  <span>Date</span>
                  <strong>{formattedDate}</strong>
                </div>
              </div>

              <div className={styles.infoCard}>
                <MapPin size={18} />
                <div>
                  <span>Location</span>
                  <strong>{event.location}</strong>
                </div>
              </div>

              <div className={styles.infoCard}>
                <Users size={18} />
                <div>
                  <span>Availability</span>
                  <strong>
                    {event.availableSeats} / {event.totalSeats} seats
                  </strong>
                </div>
              </div>
            </div>

            <div className={styles.detailStrip}>
              <div className={styles.featureCard}>
                <Sparkles size={18} />
                <div>
                  <span>Booking</span>
                  <p>Simple booking.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <Ticket size={18} />
                <div>
                  <span>Price</span>
                  <p>SEK {event.price.toLocaleString("sv-SE")} per seat.</p>
                </div>
              </div>
            </div>

            <div className={styles.pricePanel}>
              <div>
                <span className={styles.priceLabel}>{getAvailabilityLabel(event)}</span>
                <p className={styles.price}>
                  SEK {event.price.toLocaleString("sv-SE")}
                  <span> / seat</span>
                </p>
              </div>
              <p className={styles.priceNote}>
                Book now. Pay later.
              </p>
            </div>
          </div>

          <div className={styles.bookingFormWrapper}>
            <BookingForm event={event} onBookingSuccess={() => {}} />
          </div>
        </div>
      </section>
    </div>
  );
}
