import { NextResponse } from "next/server";



const baseUrl= process.env.NEXT_PUBLIC_API_EVENTS;

export async function GET(request: Request,  context:  { params:Promise<{ id: string }>}){
    const {id}= await context.params;
    const backendUrl= `${baseUrl}/${id}`
    
try{
const response = await fetch(backendUrl);
if(!response.ok){
    const text = await response.text();
    console.error("Backend event Get error", response.status, text);
    return NextResponse.json(
    {message:`Backend error: ${response.status}` },
    { status: response.status });
}
const event = await  response.json();
return NextResponse.json(event);
}catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
