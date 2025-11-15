import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");
    const r = await fetch(`${process.env.BACKEND_URL}/api/auth/check-email?email=${encodeURIComponent(email || "")}`, {
        cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
}
