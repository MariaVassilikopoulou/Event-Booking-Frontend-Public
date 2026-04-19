import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const backendUrl = process.env.NEXT_PUBLIC_API_AI_RECOMMENDATIONS ?? "";

export async function GET(req: Request) {
  try {
    if (!backendUrl) {
      console.error("Missing NEXT_PUBLIC_API_AI_RECOMMENDATIONS in .env");
      return NextResponse.json({ message: "Server config error" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization");

    const response = await fetch(backendUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend recommendations error", response.status, text);
      return NextResponse.json({ message: "Backend error" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Recommendations proxy error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
