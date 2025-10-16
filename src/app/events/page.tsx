"use client"

import { useEffect, useState } from 'react';
import { getEvents} from '../../services/eventService';
import EventCard from '@/components/EventCard';
import { Event } from '@/types/globalTypes';
import styles from "../../styles/EventCard.module.scss"


export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles['page-wrapper']}>
       <div className={styles.container}>
      <h1>Upcoming Events</h1>
      <p>Browse and book your favorite events</p>
      <div className={styles.eventsList}>
        {events.length > 0 ? (
          events.map((ev) => <EventCard key={ev.id} event={ev} />)
        ) : (
          <p>No events found.</p>
        )}
      </div>
      </div>
    </div>
    
  );
}