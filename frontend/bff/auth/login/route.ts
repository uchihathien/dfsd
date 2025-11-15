import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function POST(req: NextRequest) {
    const body = await req.text();

    const res = await backendFetch("/api/auth/login", {
        method: "POST",
        headers: {
            "content-type": req.headers.get("content-type") ?? "application/json",
        },
        body,
    });

    const text = await res.text();

    const out = new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });

    // forward JWT cookies (access / refresh) từ backend nếu có
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);

    return out;
}
