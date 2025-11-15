import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function POST(req: NextRequest) {
    const res = await backendFetch("/api/auth/logout", {
        method: "POST",
        headers: {
            cookie: req.headers.get("cookie") ?? "",
        },
    });

    const out = new NextResponse(null, { status: res.status });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);

    return out;
}
