"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Event, Booking } from "@/types/globalTypes";
import { getEvents, createEvent, updateEvent, deleteEvent, CreateEventDto } from "@/services/eventService";
import { generateEventDescription } from "@/services/aiAssistantService";
import styles from "../../styles/AdminPage.module.scss";
import { toast } from "sonner";

const BOOKINGS_URL = process.env.NEXT_PUBLIC_API_BOOKINGS;

const emptyForm: CreateEventDto = { name: "", description: "", date: "", location: "", price: 0, totalSeats: 0 };

export default function AdminPage() {
    const { isLoggedIn, isAdmin, token } = useAuthStore();
    const router = useRouter();
    const [tab, setTab] = useState<"events" | "bookings">("events");

    // Events state
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CreateEventDto>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);

    // Bookings state
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsLoaded, setBookingsLoaded] = useState(false);

    useEffect(() => {
        if (!isLoggedIn || !isAdmin) {
            router.replace("/");
            return;
        }
        getEvents()
            .then(setEvents)
            .catch(() => toast.error("Failed to load events."))
            .finally(() => setEventsLoading(false));
    }, [isLoggedIn, isAdmin, router]);

    const loadBookings = async () => {
        if (bookingsLoaded) return;
        setBookingsLoading(true);
        try {
            const res = await fetch(`${BOOKINGS_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            setBookings(await res.json());
            setBookingsLoaded(true);
        } catch {
            toast.error("Failed to load bookings.");
        } finally {
            setBookingsLoading(false);
        }
    };

    const handleTabChange = (t: "events" | "bookings") => {
        setTab(t);
        if (t === "bookings") loadBookings();
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (ev: Event) => {
        setEditingId(ev.id);
        setForm({
            name: ev.name,
            description: ev.description ?? "",
            date: ev.date.slice(0, 16),
            location: ev.location,
            price: ev.price,
            totalSeats: ev.totalSeats,
        });
        setShowForm(true);
    };

    const handleGenerateDescription = async () => {
        if (!token || !form.name) return;
        setGenerating(true);
        try {
            const description = await generateEventDescription({
                eventName: form.name,
                location: form.location || "TBD",
                date: form.date || "TBD",
                price: form.price ? `${form.price}` : "TBD",
            }, token);
            setForm(f => ({ ...f, description }));
        } catch {
            toast.error("Could not generate description. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!token) return;
        setSaving(true);
        try {
            if (editingId) {
                const updated = await updateEvent(editingId, form, token);
                setEvents(prev => prev.map(e => e.id === editingId ? updated : e));
                toast.success("Event updated.");
            } else {
                const created = await createEvent(form, token);
                setEvents(prev => [...prev, created]);
                toast.success("Event created.");
            }
            setShowForm(false);
            setForm(emptyForm);
            setEditingId(null);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        if (!token) return;
        setDeletingId(id);
        try {
            await deleteEvent(id, token);
            setEvents(prev => prev.filter(e => e.id !== id));
            toast.success("Event deleted.");
        } catch {
            toast.error("Failed to delete event.");
        } finally {
            setDeletingId(null);
        }
    };

    if (!isLoggedIn || !isAdmin) return null;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h1>Admin Dashboard</h1>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${tab === "events" ? styles.tabActive : ""}`}
                        onClick={() => handleTabChange("events")}
                    >
                        Events
                    </button>
                    <button
                        className={`${styles.tab} ${tab === "bookings" ? styles.tabActive : ""}`}
                        onClick={() => handleTabChange("bookings")}
                    >
                        All Bookings
                    </button>
                </div>

                {tab === "events" && (
                    <>
                        {showForm && (
                            <div className={styles.formCard}>
                                <h2>{editingId ? "Edit Event" : "New Event"}</h2>
                                <div className={styles.formGrid}>
                                    <div className={styles.field}>
                                        <label>Name</label>
                                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Location</label>
                                        <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Date & Time</label>
                                        <input type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Price (SEK)</label>
                                        <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Total Seats</label>
                                        <input type="number" min="1" value={form.totalSeats} onChange={e => setForm(f => ({ ...f, totalSeats: Number(e.target.value) }))} />
                                    </div>
                                </div>
                                <div className={styles.field} style={{ marginTop: "1rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                                        <label style={{ margin: 0 }}>Description</label>
                                        <button
                                            type="button"
                                            className={styles.generateBtn}
                                            onClick={handleGenerateDescription}
                                            disabled={generating || !form.name}
                                            title={!form.name ? "Enter an event name first" : ""}
                                        >
                                            {generating ? "Generating…" : "✨ Generate with AI"}
                                        </button>
                                    </div>
                                    <textarea
                                        rows={3}
                                        placeholder="A short description of the event (optional)..."
                                        value={form.description ?? ""}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    />
                                </div>
                                <div className={styles.formActions}>
                                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                                        {saving ? "Saving…" : editingId ? "Save Changes" : "Create Event"}
                                    </button>
                                    <button className={styles.cancelFormBtn} onClick={() => { setShowForm(false); setEditingId(null); }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {!showForm && (
                            <button className={styles.newBtn} onClick={openCreate}>+ New Event</button>
                        )}

                        {eventsLoading ? (
                            [...Array(4)].map((_, i) => <div key={i} className={styles.skeleton} />)
                        ) : events.length === 0 ? (
                            <p className={styles.empty}>No events yet. Create one above.</p>
                        ) : (
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Location</th>
                                            <th>Price</th>
                                            <th>Seats</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map(ev => (
                                            <tr key={ev.id}>
                                                <td>{ev.name}</td>
                                                <td>{new Date(ev.date).toLocaleDateString("en-SE", { dateStyle: "medium" })}</td>
                                                <td>{ev.location}</td>
                                                <td>{ev.price} SEK</td>
                                                <td>{ev.availableSeats} / {ev.totalSeats}</td>
                                                <td>
                                                    <div className={styles.rowActions}>
                                                        <button className={styles.editBtn} onClick={() => openEdit(ev)}>Edit</button>
                                                        <button
                                                            className={styles.deleteBtn}
                                                            onClick={() => handleDelete(ev.id, ev.name)}
                                                            disabled={deletingId === ev.id}
                                                        >
                                                            {deletingId === ev.id ? "…" : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {tab === "bookings" && (
                    <>
                        {bookingsLoading ? (
                            [...Array(5)].map((_, i) => <div key={i} className={styles.skeleton} />)
                        ) : bookings.length === 0 && bookingsLoaded ? (
                            <p className={styles.empty}>No bookings found.</p>
                        ) : (
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Event</th>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Seats</th>
                                            <th>Status</th>
                                            <th>Booked on</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map(b => {
                                            const status = b.status ?? "Pending";
                                            return (
                                                <tr key={b.id}>
                                                    <td>{b.eventName}</td>
                                                    <td>{b.userName}</td>
                                                    <td>{b.userEmail}</td>
                                                    <td><span className={styles.seatsBadge}>{b.seats}</span></td>
                                                    <td>
                                                        <span className={status === "Paid" ? styles.paidBadge : styles.badge}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(b.bookingDate).toLocaleDateString("en-SE", { dateStyle: "medium" })}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
