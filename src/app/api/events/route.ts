import { NextResponse } from "next/server";



const backendUrl= process.env.NEXT_PUBLIC_API_EVENTS ?? "";

export async function GET(){
try{

if (!backendUrl) {
    console.error("Missing NEXT_PUBLIC_API_EVENTS in .env");
    return NextResponse.json({ message: "Server config error" }, { status: 500 });
  }
const response = await fetch(backendUrl);
if(!response.ok){
    const text = await response.text();
    console.error("Backend event Get error", response.status, text);
    return NextResponse.json({message:`Backend error: ${response.status}` }, { status: response.status });
}
const events = await  response.json();
return NextResponse.json(events);
}catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
