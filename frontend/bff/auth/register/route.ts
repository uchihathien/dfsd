import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function POST(req: NextRequest) {
    const body = await req.text();

    const res = await backendFetch("/api/auth/register", {
        method: "POST",
        headers: {
            "content-type": req.headers.get("content-type") ?? "application/json",
        },
        body,
    });

    const text = await res.text();
    return new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });
}
