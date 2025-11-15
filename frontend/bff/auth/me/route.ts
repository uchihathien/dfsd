import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function GET(req: NextRequest) {
    const res = await backendFetch("/api/auth/me", {
        headers: {
            cookie: req.headers.get("cookie") ?? "",
            accept: "application/json",
        },
        cache: "no-store",
    });

    const text = await res.text();
    return new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });
}
