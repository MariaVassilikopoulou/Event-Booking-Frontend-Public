import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const token = request.headers.get("authorization");
    const body = await request.json();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_PAYMENT}/create-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token || "",
            },
            body: JSON.stringify(body),
        });
        const text = await res.text();
        let data: unknown;
        try { data = JSON.parse(text); } catch { data = { message: text || "Unknown error from payment service" }; }
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Payment checkout error", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
