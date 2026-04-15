"use client"

import { useState } from 'react';
import useSWR from 'swr';
import EventCard from '@/components/EventCard';
import { Event } from '@/types/globalTypes';
import styles from "../../styles/EventCard.module.scss"

const PAGE_SIZE = 6;

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error("Failed to load events");
  return r.json();
});

export default function EventsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: events, error, isLoading } = useSWR<Event[]>('/api/events', fetcher);

  const visible = (events ?? []).slice(0, visibleCount);
  const hasMore = events ? visibleCount < events.length : false;

  if (isLoading) return (
    <div className={styles['page-wrapper']}>
      <div className={styles.container}>
        <h1>Upcoming Events</h1>
        <p>Browse and book your favorite events</p>
        <div className={styles.eventsList}>
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className={styles['page-wrapper']}>
      <div className={styles.container}>
        <p role="alert" style={{ textAlign: "center", color: "#dc2626", marginTop: "2rem" }}>
          Could not load events. Please refresh the page.
        </p>
      </div>
    </div>
  );

  return (
    <div className={styles['page-wrapper']}>
      <div className={styles.container}>
        <h1>Upcoming Events</h1>
        <p>Browse and book your favorite events</p>
        <div className={styles.eventsList}>
          {visible.length > 0 ? (
            visible.map((ev) => <EventCard key={ev.id} event={ev} />)
          ) : (
            <p style={{ textAlign: "center", color: "#888" }}>No events available yet. Check back soon!</p>
          )}
        </div>
        {hasMore && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className={styles.loadMoreBtn}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
