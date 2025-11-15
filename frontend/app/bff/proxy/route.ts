import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { url, method = "GET", body } = await req.json();
    const cookieStore = await cookies();
    const access = cookieStore.get("access_token")?.value ?? "";

    const r = await fetch(`${process.env.BACKEND_URL}${url}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access}`
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store"
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
}
