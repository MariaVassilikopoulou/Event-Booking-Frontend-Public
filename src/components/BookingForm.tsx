import { Event } from "@/types/globalTypes";
import { useState } from "react";
import styles from "../styles/BookingForm.module.scss";
import { createBooking } from "@/services/bookingService";
import { useRouter } from "next/navigation";

interface Props{
    event:Event;
    onBookingSuccess?: () => void;
}

export default function BookingForm({event,  onBookingSuccess }:Props){
   const [name, setName]= useState("");
   const [email, setEmail]= useState("");
   const [seats, setSeats]= useState(1);
   const [loading, setLoading]= useState(false);
   const [message, setMessage]= useState("");
   const total= (event.price * seats).toFixed(2);
  const router= useRouter();

   const handleSubmit= async (e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    setMessage("");
    router.push(`/booking-success?event=${event.id}`);


    try{
      const bookingDto={
        userName:name,
        userEmail:email,
        seats,
        eventId: event.id,
      };
      const result = await createBooking(bookingDto);
        console.log("Booking result;",result);
        setMessage("booking submitted succesfully");
        onBookingSuccess?.();
    }catch(error){
        console.error("Booking failed", error);
        setMessage("Booking failed, Please try again");
    }finally{
        setLoading(false)
    }
   };

   return (
    <div className={styles.formwrapper}>
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Book Your Seats</h3>

      <label>Full Name</label>
      <input value={name} onChange={e => setName(e.target.value)} required />

      <label>Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} required />

      <label>Number of Seats</label>
      <input
        type="number"
        min="1"
        max={event.availableSeats}
        value={seats}
        onChange={e => setSeats(Number(e.target.value))}
      />

      <p className={styles.total}>Total: ${total}</p>

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Confirm Booking"}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </form>
    </div>
  );
}



