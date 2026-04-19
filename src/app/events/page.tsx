"use client"

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import EventCard from '@/components/EventCard';
import { Event } from '@/types/globalTypes';
import { useAuthStore } from '@/stores/useAuthStore';
import { semanticSearch, getRecommendedEvents } from '@/services/searchService';
import styles from "../../styles/EventCard.module.scss"

const PAGE_SIZE = 6;

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error("Failed to load events");
  return r.json();
});

export default function EventsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: events, error, isLoading } = useSWR<Event[]>('/api/events', fetcher);

  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const [recommended, setRecommended] = useState<Event[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    getRecommendedEvents().then(setRecommended).catch(() => {});
  }, [isLoggedIn]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    setSearchError('');
    try {
      const results = await semanticSearch(q);
      setSearchResults(results);
    } catch {
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchResults(null);
    setSearchError('');
  }

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

        {/* Semantic Search Bar */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Try: 'romantic evening' or 'fun for kids'..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn} disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
          {searchResults !== null && (
            <button type="button" className={styles.clearBtn} onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>

        {/* Semantic Search Results */}
        {searchResults !== null && (
          <div className={styles.searchResultsSection}>
            <p className={styles.searchResultsLabel}>
              {searchResults.length > 0
                ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </p>
            {searchError && <p style={{ color: '#dc2626', textAlign: 'center' }}>{searchError}</p>}
            <div className={styles.eventsList}>
              {searchResults.map(ev => <EventCard key={ev.id} event={ev} />)}
            </div>
          </div>
        )}

        {/* Recommended for You — logged-in users only, hidden when searching */}
        {!searchResults && isLoggedIn && recommended.length > 0 && (
          <div className={styles.recommendedSection}>
            <h2 className={styles.recommendedTitle}>Recommended for You</h2>
            <div className={styles.recommendedScroll}>
              {recommended.map(ev => (
                <div key={ev.id} className={styles.recommendedCard}>
                  <EventCard event={ev} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Events Grid — hidden when showing search results */}
        {!searchResults && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
