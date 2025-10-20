import Link from "next/link"

export default function BookingSuccessPage(){
    return(
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Booking Confirmed!</h1>
            <p>Thank you for your booking.A confirmation email has been sent.</p>
            <Link href={"/"}  style={{ color: "blue" }}>Back to Events</Link>
        </div>
    )
}