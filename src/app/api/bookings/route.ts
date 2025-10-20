import { NextResponse } from "next/server";

const  backendUrl= "http://localhost:5038/api/booking";

export async function POST (request: Request){
    const body = await request.json();

    try{
        const res= await fetch(backendUrl,
            { method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              });
              if (!res.ok) {
                const text = await res.text();
                return NextResponse.json({ message: text }, { status: res.status });
              }

              const data= await res.json();
              return NextResponse.json(data);
            }catch(error){
                console.error("Booking Post error", error);
                return NextResponse.json({message:"Internal server error"}, {status:500});
            }
    }
