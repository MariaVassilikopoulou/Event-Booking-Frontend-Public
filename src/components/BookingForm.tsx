import { Event } from "@/types/globalTypes";
import { useState } from "react";
import styles from "../styles/BookingForm.module.scss";
interface Props{
    event:Event;
}

export default function BookingForm({event}:Props){
   const [name, setName]= useState("");
   const [email, setEmail]= useState("");
   const [seats, setSeats]= useState(1);
   const [loading, setLoading]= useState(false);
   const [message, setMessage]= useState("");
   const total= (event.price * seats).toFixed(2);

   const handleSubmit= async (e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    setMessage("");


    try{
        console.log("Booking;",{name, email,seats, eventId: event.id});
        setMessage("booking submitted succesfully");
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



