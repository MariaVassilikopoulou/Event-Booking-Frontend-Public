import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_BOOKINGS ?? "";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ eventId: string; bookingId: string }> }
) {
    const token = request.headers.get("authorization");
    const { eventId, bookingId } = await params;
    const res = await fetch(`${backendUrl}/${eventId}/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
    });
    return new NextResponse(null, { status: res.status });
}
