import { NextResponse } from "next/server";



const backendUrl= "http://localhost:5038/api/events";

export async function GET(){
try{
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
