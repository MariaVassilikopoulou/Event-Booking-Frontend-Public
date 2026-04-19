import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_AI_ASSISTANT_GENERATE ?? "";

export async function POST(req: Request) {
    try {
        if (!backendUrl) {
            return NextResponse.json({ message: "Server config error" }, { status: 500 });
        }

        const body = await req.json();
        const authHeader = req.headers.get("authorization");

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { "Authorization": authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Backend generate-description error", response.status, text);
            return NextResponse.json({ message: "Backend error" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Generate description proxy error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
