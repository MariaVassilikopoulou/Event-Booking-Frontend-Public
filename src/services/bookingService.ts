import { CreateBookingDto } from "@/types/globalTypes";

export const createBooking= async (booking: CreateBookingDto)=>{ 
    const token= localStorage.getItem("token");
    const res= await fetch("/api/bookings",{
        method: "POST",
        headers: {"Content-Type": "application/json",
            Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
        body:JSON.stringify(booking),
    });

    if(!res.ok){
        const text = await res.text();
        throw new Error(`Booking failed: ${res.status} ${text}`);
    }
    return res.json();
}