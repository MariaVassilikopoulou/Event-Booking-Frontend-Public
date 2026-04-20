"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import EventCard from "@/components/EventCard";
import { Event } from "@/types/globalTypes";
import { useAuthStore } from "@/stores/useAuthStore";
import { semanticSearch, getRecommendedEvents } from "@/services/searchService";
import styles from "../../styles/EventCard.module.scss";

const PAGE_SIZE = 6;

const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load events");
    }

    return response.json();
  });

export default function EventsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: events, error, isLoading } = useSWR<Event[]>("/api/events", fetcher);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [recommended, setRecommended] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Event[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    getRecommendedEvents().then(setRecommended).catch(() => {});
  }, [isLoggedIn]);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const results = await semanticSearch(query);
      setSearchResults(results);
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  function clearSearch() {
    setSearchQuery("");
    setSearchResults(null);
    setSearchError("");
  }

  const visible = (events ?? []).slice(0, visibleCount);
  const hasMore = events ? visibleCount < events.length : false;

  if (isLoading) {
    return (
      <>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.heroEyebrow}>Events</span>
          <h1 className={styles.heroTitle}>Find your next experience.</h1>
          <p className={styles.heroSubtitle}>
            Browse and book events.
          </p>
          </div>
        </div>

        <div className={styles.pageWrapper}>
          <div className={styles.container}>
            <div className={styles.eventsList}>
              {[...Array(PAGE_SIZE)].map((_, index) => (
                <div key={index} className={styles.skeleton} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <p role="alert" className={styles.errorState}>
            Could not load events. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>Events</span>
          <h1 className={styles.heroTitle}>Find your next experience.</h1>
          <p className={styles.heroSubtitle}>
            Search by city or date.
          </p>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Try: 'romantic evening', 'startup event', or 'fun for kids'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn} disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </button>
            {searchResults !== null && (
              <button type="button" className={styles.clearBtn} onClick={clearSearch}>
                Clear
              </button>
            )}
          </form>

          <div className={styles.statStrip}>
            <span>AI search</span>
            <span>Live availability</span>
            <span>Online booking</span>
          </div>
        </div>
      </section>

      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {searchResults !== null && (
            <section className={styles.searchResultsSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>Search results</span>
                  <h2 className={styles.sectionTitle}>
                    {searchResults.length > 0 ? "Matching experiences" : "No matching experiences yet"}
                  </h2>
                </div>
                <p className={styles.searchResultsLabel}>
                  {searchResults.length > 0
                    ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`}
                </p>
              </div>

              {searchError && <p className={styles.errorState}>{searchError}</p>}

              <div className={styles.eventsList}>
                {searchResults.map((result) => (
                  <EventCard key={result.id} event={result} />
                ))}
              </div>
            </section>
          )}

          {!searchResults && isLoggedIn && recommended.length > 0 && (
            <section className={styles.recommendedSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>For you</span>
                  <h2 className={styles.sectionTitle}>Recommended for you</h2>
                </div>
                <p className={styles.sectionCopy}>Just for you.</p>
              </div>

              <div className={styles.recommendedScroll}>
                {recommended.map((event) => (
                  <div key={event.id} className={styles.recommendedCard}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {!searchResults && (
            <section>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>Upcoming events</span>
                  <h2 className={styles.sectionTitle}>What&apos;s on now</h2>
                </div>
                <p className={styles.sectionCopy}>Details, price, and seats.</p>
              </div>

              <div className={styles.eventsList}>
                {visible.length > 0 ? (
                  visible.map((event) => <EventCard key={event.id} event={event} />)
                ) : (
                  <p className={styles.emptyState}>No events available yet. Check back soon.</p>
                )}
              </div>

              {hasMore && (
                <div className={styles.loadMoreWrap}>
                  <button
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    className={styles.loadMoreBtn}
                  >
                    Load more events
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
